from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import NotePad
from core.serializers import NotePadSerializer


class NotePadAPIView(APIView):
    def get(self, request):
        note_pad = NotePad.objects.all()
        serializer = NotePadSerializer(note_pad, many=True)
        return Response(serializer.data)

    def patch(self, request):
        note_pad = NotePad.objects.all()
        serializer = NotePadSerializer(note_pad, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
