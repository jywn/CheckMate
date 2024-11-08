from django.http import JsonResponse
from core.models import Task
from core.models import SubTask

def display_tasks(request, user_id):
    tasks = Task.objects.filter(user_id=user_id)
    return None

def display_subtasks(request, user_id, task_id):
    sub_tasks = SubTask.objects.filter(user_id=user_id, task_id=task_id)
    # @response the list of subtasks
    return JsonResponse({'task_id': task_id})

def complete_subtask(request, user_id, task_id, subtask_id):
    sub_task = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
    #@ response the result of completion in HTTP CODE
    return JsonResponse({'task_id': task_id, 'subtask_id': subtask_id})

def display_reviews(request, user_id):
    tasks = Task.objects.filter(user_id=user_id)
    return None
# Display reviews for tasks completed by the user
def display_reviews(request, user_id):
    tasks = Task.objects.filter(user_id=user_id, completed=True)
    reviews = [{'task_id': task.id, 'rating': task.rating, 'review': task.review} for task in tasks if task.rating is not None]
    return JsonResponse({'reviews': reviews})

# Add rating and review for a task
@csrf_exempt
def add_review(request, user_id, task_id):
    if request.method == 'POST':
        try:
            task = Task.objects.get(user_id=user_id, id=task_id)
            data = json.loads(request.body)
            rating = data.get('rating')
            review = data.get('review')

            if rating is None or not (1 <= rating <= 5):
                return JsonResponse({'error': 'Rating must be between 1 and 5'}, status=400)

            task.rating = rating
            task.review = review
            task.save()

            return JsonResponse({'message': 'Review added successfully', 'task_id': task_id})
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def complete_subtask(request, user_id, task_id, subtask_id):
    sub_task = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
    #@ response the result of completion in HTTP CODE
    return JsonResponse({'task_id': task_id, 'subtask_id': subtask_id})