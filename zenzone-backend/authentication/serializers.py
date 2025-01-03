from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'date_joined')
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
            'email': {'required': False},  # Make email optional for updates
            'username': {'required': False}  # Make username optional for updates
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
        
    def update(self, instance, validated_data):
        # Handle password update separately
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
            
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if 'date_joined' in ret and ret['date_joined']:
            ret['date_joined'] = instance.date_joined.strftime('%Y-%m-%d %H:%M:%S')
        return ret