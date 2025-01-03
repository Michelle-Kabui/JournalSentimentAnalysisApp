from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'date_joined')
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

    def to_representation(self, instance):
        """Convert the user instance to JSON, excluding password"""
        ret = super().to_representation(instance)
        # Format date_joined to a readable string if it exists
        if 'date_joined' in ret and ret['date_joined']:
            ret['date_joined'] = instance.date_joined.strftime('%Y-%m-%d %H:%M:%S')
        return ret