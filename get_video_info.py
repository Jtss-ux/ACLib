import sys
from youtube_transcript_api import YouTubeTranscriptApi
import urllib.request
import json
import re

video_id = "l5L3iZzk408"

# Get title
try:
    url = f"https://www.youtube.com/watch?v={video_id}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    title_match = re.search(r'<title>(.*?)</title>', html)
    title = title_match.group(1) if title_match else "Unknown Title"
    print(f"TITLE: {title}")
except Exception as e:
    print(f"Error getting title: {e}")

# Get transcript
try:
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    text = " ".join([t['text'] for t in transcript_list])
    print(f"TRANSCRIPT_LENGTH: {len(text)}")
    print(f"TRANSCRIPT_PREVIEW: {text[:1000]}")
    with open('transcript.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Transcript saved to transcript.txt")
except Exception as e:
    print(f"Error getting transcript: {e}")
