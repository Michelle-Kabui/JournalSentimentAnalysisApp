from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from authentication.serializers import UserSerializer  
from rest_framework.permissions import IsAuthenticated
from journal_sentiment.model_loader import SentimentAnalyzer
from rest_framework.decorators import action
from rest_framework.response import Response
from . import analytics

# Initialize sentiment analyzer
sentiment_analyzer = SentimentAnalyzer()

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Analyze sentiment before saving
        content = serializer.validated_data.get('content', '')
        sentiment = sentiment_analyzer.predict_sentiment(content)
        serializer.save(user=self.request.user, sentiment=sentiment)

    def perform_update(self, serializer):
        # Re-analyze sentiment on update
        content = serializer.validated_data.get('content', '')
        sentiment = sentiment_analyzer.predict_sentiment(content)
        serializer.save(sentiment=sentiment)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        timeframe = request.query_params.get('timeframe', 'weekly')
        
        if timeframe not in ['daily', 'weekly', 'monthly']:
            return Response({'error': 'Invalid timeframe'}, status=400)
        
        data = {
            'sentiment_summary': analytics.get_sentiment_summary(request.user, timeframe),
            'sentiment_trends': analytics.get_sentiment_trends(request.user, timeframe),
            'mood_analysis': analytics.get_mood_analysis(request.user, timeframe),
            'timeframe': timeframe
        }
        
        return Response(data)

    
        
        