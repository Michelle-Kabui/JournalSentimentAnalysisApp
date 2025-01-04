from django.db.models import Count
from django.db.models.functions import TruncDate, TruncHour
from datetime import datetime, timedelta
from django.utils import timezone

def get_sentiment_summary(user, timeframe='weekly'):
    if timeframe == 'daily':
        start_date = timezone.now() - timedelta(days=1)
    elif timeframe == 'weekly':
        start_date = timezone.now() - timedelta(days=7)
    else:  # monthly
        start_date = timezone.now() - timedelta(days=30)

    entries = user.journalentry_set.filter(created_at__gte=start_date)
    total_entries = entries.count()
    
    if total_entries == 0:
        return {'positive': 0, 'neutral': 0, 'negative': 0}
    
    sentiment_counts = entries.values('sentiment').annotate(count=Count('id'))
    
    summary = {'positive': 0, 'neutral': 0, 'negative': 0}
    for item in sentiment_counts:
        percentage = (item['count'] / total_entries) * 100
        summary[item['sentiment']] = round(percentage, 2)
    
    return summary

def get_sentiment_trends(user, timeframe='weekly'):
    now = timezone.now()
    
    if timeframe == 'daily':
        start_date = now - timedelta(days=1)
        trunc_function = TruncHour
        date_format = '%H:%M:%S%z'
    elif timeframe == 'weekly':
        start_date = now - timedelta(days=7)
        trunc_function = TruncDate
        date_format = '%Y-%m-%d'
    else:  # monthly
        start_date = now - timedelta(days=30)
        trunc_function = TruncDate
        date_format = '%Y-%m-%d'
    
    entries = user.journalentry_set.filter(
        created_at__gte=start_date
    ).annotate(
        date=trunc_function('created_at')
    ).values('date', 'sentiment').annotate(
        count=Count('id')
    ).order_by('date')
    
    trend_data = {}
    for entry in entries:
        if timeframe == 'daily':
            # For daily view, use the full datetime with timezone
            date_str = entry['date'].isoformat()
        else:
            date_str = entry['date'].strftime(date_format)
            
        if date_str not in trend_data:
            trend_data[date_str] = {'positive': 0, 'neutral': 0, 'negative': 0}
        trend_data[date_str][entry['sentiment']] = entry['count']
    
    return trend_data

def get_mood_analysis(user, timeframe='weekly'):
    if timeframe == 'daily':
        start_date = timezone.now() - timedelta(days=1)
        date_format = '%H:%M'
    elif timeframe == 'weekly':
        start_date = timezone.now() - timedelta(days=7)
        date_format = '%Y-%m-%d'
    else:
        start_date = timezone.now() - timedelta(days=30)
        date_format = '%Y-%m-%d'
    
    entries = user.journalentry_set.filter(created_at__gte=start_date)
    
    mood_counts = entries.values('mood').annotate(count=Count('id'))
    
    mood_timeline = {}
    for entry in entries.values('mood', 'created_at'):
        mood = entry['mood']
        timestamp = entry['created_at'].strftime(date_format)
        if mood not in mood_timeline:
            mood_timeline[mood] = []
        mood_timeline[mood].append(timestamp)
    
    return {
        'counts': list(mood_counts),
        'timeline': mood_timeline
    }