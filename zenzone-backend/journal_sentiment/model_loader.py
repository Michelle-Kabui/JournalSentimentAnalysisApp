import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
import traceback

class SentimentAnalyzer:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        model_path = os.path.join(os.path.dirname(__file__), 'models/sentiment_model.pth')
        
        self.tokenizer = AutoTokenizer.from_pretrained("Davlan/afro-xlmr-small")
        self.model = AutoModelForSequenceClassification.from_pretrained(
            "Davlan/afro-xlmr-small",
            num_labels=3
        )
        
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()

    def predict_sentiment(self, text):  # Make sure this method name matches exactly
        try:
            print("Input text:", text)
            
            inputs = self.tokenizer(
                text,
                padding='max_length',
                truncation=True,
                max_length=512,
                return_tensors="pt"
            )
            
            print("Tokenized length:", len(inputs['input_ids'][0]))
            print("First few tokens:", self.tokenizer.decode(inputs['input_ids'][0][:10]))
            
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
                predicted_class = torch.argmax(predictions, dim=-1).item()
                
                probs = predictions[0].cpu().numpy()
                print("Prediction probabilities:")
                print(f"Positive: {probs[0]:.3f}")
                print(f"Neutral: {probs[1]:.3f}")
                print(f"Negative: {probs[2]:.3f}")

            sentiment_map = {
                0: 'positive',
                1: 'neutral',
                2: 'negative'
            }
            result = sentiment_map[predicted_class]
            print("Final sentiment:", result)
            return result
            
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            print(f"Stack trace:", traceback.format_exc())
            return 'neutral'