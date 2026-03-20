export interface InsertTestTypes {
  test_name: string
  user_id: string
}

export interface GetTestTypes {
  id: number
  created_at: Date
  test_name: string
  user_id: number
}

export interface GetDailyCounts {
  id: number
  created_at?: Date;
  date: string;
  particles: number;
  liters: number;
  test_id: number;
  original_img?: string;
  density_map_img: number[]
}

export interface InsertDailyCounts {
  particles: number;
  date: string;
  liters: number;
  test_id?: number;
  original_img?: string;
  density_map_img: number[]
}

export interface InsertAccuracyTests {
  predicted_count: number;
  real_count: number;
  date: string;
  liters: number;
  test_id?: number;
  original_img?: string;
  density_map_img: number[];
}

export interface GetAccuracyTest {
  id: number;
  created_at?: Date;
  date: string;
  real_count: number;
  predicted_count: number;
  liters: number;
  test_id?: number;
  original_img?: string;
  density_map_img: number[];
}