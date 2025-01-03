from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Assessment
from .serializers import AssessmentSerializer

class AssessmentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            assessments = Assessment.objects.filter(user=request.user)
            serializer = AssessmentSerializer(assessments, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in assessment history: {str(e)}")  # Debug log
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SaveAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            print("Received data:", request.data)  # Debug print
            serializer = AssessmentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print("Serializer errors:", serializer.errors)  # Debug print
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error saving assessment:", str(e))  # Debug print
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )