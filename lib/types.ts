export interface Task {
  task: string
  who: string
  deadline: string | null
  category: string
  context?: string
}
