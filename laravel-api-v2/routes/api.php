<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Task;

Route::get('/tasks', function () {
    return Task::all(); // DBから全件取得
});

Route::post('/tasks', function (Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:225',
        'body' => 'nullable|string', 
    ]);

    $task = Task::create([
        'title' => $validated['title'],
        'body'=> $validated['body'] ?? '',
        'completed' => false,
    ]);

    return response()->json($task);

});


Route::put('/tasks/{id}', function ($id, Request $request) {
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'nullable|string',
        'completed' => 'boolean',
    ]);
    

    $task = Task::findOrFail($id);
    $task->update($validated);
    return response()->json($task);

});

Route::delete('/tasks/{id}', function($id) {
    $task = Task::findOrFail($id);
    $task->delete();

    return response()->json(['message' => '削除しました']);
});





