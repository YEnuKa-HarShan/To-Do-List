package com.example.todolistbackend.service;

import com.example.todolistbackend.model.Task;
import com.example.todolistbackend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // සියලුම tasks ලබාගන්න
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // ID එකෙන් task එකක් ලබාගන්න
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // නව task එකක් save කරනවා
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Task එකක් update කරනවා
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setText(taskDetails.getText());
        task.setCompleted(taskDetails.isCompleted());
        return taskRepository.save(task);
    }

    // Task එකක් delete කරනවා
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}