from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from openai import OpenAI
import json

class ChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            print("Received chat request from:", request.user.username)
            print("Request data:", request.data)
            
            message = request.data.get('message')
            if not message:
                return Response(
                    {'error': 'No message provided'}, 
                    status=400
                )

            # Initialize OpenAI client
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            print("OpenAI client initialized")

            try:
                # System message to guide the model's behavior
                system_message = """You are a supportive and empathetic AI assistant focused on mental health and wellness. 
                While you can provide general information and emotional support, you must:
                1. Never provide medical diagnoses
                2. Never recommend specific treatments or medications
                3. Always encourage seeking professional help for medical concerns
                4. Maintain a calm, supportive tone
                5. Focus on general wellness and coping strategies
                6. Be clear about your limitations as an AI
                7. Recognize signs of crisis and provide appropriate crisis resources"""

                # Create the conversation with new API
                print("Sending request to OpenAI")
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": message}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                print("Received response from OpenAI")

                # Extract the response
                ai_response = response.choices[0].message.content
                print("AI Response length:", len(ai_response))

                # Check for crisis keywords
                crisis_keywords = ['suicide', 'kill', 'die', 'hurt', 'harm', 'end my life']
                if any(keyword in message.lower() for keyword in crisis_keywords):
                    crisis_resources = """
                    If you're having thoughts of suicide or self-harm, please reach out for help immediately:
                    
                    Emergency Services: Call 911
                    National Suicide Prevention Lifeline (US): 1-800-273-8255
                    Crisis Text Line: Text HOME to 741741
                    
                    You're not alone. Professional help is available 24/7."""
                    
                    ai_response += "\n\n" + crisis_resources

                return Response({'response': ai_response})
                
            except Exception as openai_error:
                print("OpenAI Error:", str(openai_error))
                return Response(
                    {'error': f'OpenAI Error: {str(openai_error)}'}, 
                    status=503
                )

        except Exception as e:
            print("General Error:", str(e))
            return Response(
                {'error': str(e)}, 
                status=500
            )