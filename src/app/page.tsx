'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PauseIcon, PlayIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

type Task = {
  id: number
  title: string
  duration: number
  remainingTime: number
  status: 'idle' | 'running' | 'paused' | 'completed'
}

const Page: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDuration, setNewTaskDuration] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.status === 'running' && task.remainingTime > 0
            ? { ...task, remainingTime: task.remainingTime - 1 }
            : task.status === 'running' && task.remainingTime <= 0
              ? { ...task, status: 'completed' }
              : task,
        ),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const addTask = () => {
    if (newTaskTitle && newTaskDuration) {
      const duration = parseInt(newTaskDuration)
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTaskTitle,
          duration: duration * 60,
          remainingTime: duration * 60,
          status: 'idle',
        },
      ])
      setNewTaskTitle('')
      setNewTaskDuration('')
    }
  }

  const updateTaskStatus = (id: number, status: Task['status']) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">タイムボックス</h1>
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="タスク名"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Input
          type="number"
          placeholder="時間（分）"
          value={newTaskDuration}
          onChange={(e) => setNewTaskDuration(e.target.value)}
        />
        <Button onClick={addTask}>
          <PlusIcon className="mr-2 h-4 w-4" /> 追加
        </Button>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  残り時間: {formatTime(task.remainingTime)} / {formatTime(task.duration)}
                </div>
                <div className="space-x-2">
                  {task.status !== 'completed' && (
                    <>
                      {task.status !== 'running' ? (
                        <Button size="sm" onClick={() => updateTaskStatus(task.id, 'running')}>
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => updateTaskStatus(task.id, 'paused')}>
                          <PauseIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {/* <Button size="sm" onClick={() => updateTaskStatus(task.id, 'completed')}>
                        <CheckIcon className="h-4 w-4" />
                      </Button> */}
                    </>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
