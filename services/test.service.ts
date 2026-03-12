import { supabase } from "@/lib/supabase";
import { GetTestTypes, InsertTestTypes } from "@/utils/dataTypes";

//current user or authenticated user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Get all tests
export async function getTest(): Promise<GetTestTypes[]>{
   const { data, error } = await supabase.from("test").select("*");
   if (error) {
       console.error("Error fetching tests:", error);
       return [];
   }
   return data;
};

// delete tests
export async function deleteTest(id: number){
    const { error } = await supabase.from("test").delete().eq("id", id);
    if (error) {
        console.error("Error deleting test:", error);
    };
};

// insert tests
export async function createTest(data: InsertTestTypes){
    const { error } = await supabase.from("test").insert(data).select().single();
    if (error) {
        console.error("Error creating test:", error);
    };
};