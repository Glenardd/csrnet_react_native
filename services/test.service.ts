import { supabase } from "@/lib/supabase";

// Get all tests
export async function getTest(){
   const { data, error } = await supabase.from("test").select("*");
   if (error) {
       console.error("Error fetching tests:", error);
       return [];
   }
   return data;
}

// delete tests
export async function deleteTest(id: string){
    const { error } = await supabase.from("tests").delete().eq("id", id);
    if (error) {
        console.error("Error deleting test:", error);
    }
}

// insert tests
export async function createTest(data: any){
    const { error } = await supabase.from("tests").insert(data);
    if (error) {
        console.error("Error creating test:", error);
    }
}