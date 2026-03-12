export interface InsertTestTypes{
  test_name: string
  user_id: string
}

export interface GetTestTypes{
  id: number
  created_at: Date
  test_name: string
  user_id: string
}