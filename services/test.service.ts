import { supabase } from "@/lib/supabase";
import { GetAccuracyTest, GetDailyCounts, GetTestTypes, InsertAccuracyTests, InsertDailyCounts, InsertTestTypes } from "@/utils/dataTypes";

//current user or authenticated user
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Get all tests
export async function getTest(): Promise<GetTestTypes[]> {
    const { data, error } = await supabase.from("test").select("*");
    if (error) {
        console.error("Error fetching tests:", error);
        return [];
    }
    return data;
};

// delete tests
export async function deleteTest(id: number) {
    const { error } = await supabase.from("test").delete().eq("id", id);
    if (error) {
        console.error("Error deleting test:", error);
    };
};

// insert tests
export async function createTest(data: InsertTestTypes) {
    const { error } = await supabase.from("test").insert(data).select().single();
    if (error) {
        console.error("Error creating test:", error);
    };
};

//get daily_counts contents
export async function getDailyCounts(test_id: number): Promise<GetDailyCounts[]> {

    const { data, error } = await supabase.from("daily_counts").select("*").eq("test_id", test_id);
    if (error) {
        console.error("Error fetching tests:", error);
        return [];
    }
    return data;
};

//delete daily counts data 
export async function deleteDailyCounts(id: number) {
    const { data: test, error: fetchError } = await supabase
        .from("daily_counts")
        .select("original_img")
        .eq("id", id)
        .single();

    if (fetchError) {
        console.error("Error fetching daily counts:", fetchError);
        return;
    }

    if (test?.original_img) {
        const filePath = test.original_img.replace(
            /^.+\/storage\/v1\/object\/public\/images\//,
            ""
        );

        const { error: storageError } = await supabase.storage
            .from("images")
            .remove([filePath]);

        if (storageError) {
            console.error("Error deleting image from storage:", storageError);
        }
    }

    const { error } = await supabase
        .from("daily_counts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting daily counts:", error);
    }
}

//get acurracy_tests
export async function getAccuracyTest(test_id: number): Promise<GetAccuracyTest[]> {
    const { data, error } = await supabase.from("accuracy_tests").select("*").eq("test_id", test_id);
    if (error) {
        console.error("Error fetching tests:", error);
        return [];
    }
    return data;
};

//delete accuracy tests data 
export async function deleteAccuracyTest(id: number) {
    const { data: test, error: fetchError } = await supabase
        .from("accuracy_tests")
        .select("original_img")
        .eq("id", id)
        .single();

    if (fetchError) {
        console.error("Error fetching accuracy test:", fetchError);
        return;
    }

    if (test?.original_img) {
        const filePath = test.original_img.replace(
            /^.+\/storage\/v1\/object\/public\/images\//,
            ""
        );

        const { error: storageError } = await supabase.storage
            .from("images")
            .remove([filePath]);

        if (storageError) {
            console.error("Error deleting image from storage:", storageError);
        }
    }
    const { error } = await supabase
        .from("accuracy_tests")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting accuracy test:", error);
    }
}

//insert daily counts data
export async function createDailyCounts(data: InsertDailyCounts) {
    const { error } = await supabase.from("daily_counts").insert(data).select().single();
    if (error) {
        console.error("Error creating daily counts:", error);
    };
};

//insert accuracy tests data
export async function createAccuracyTests(data: InsertAccuracyTests) {
    const { error } = await supabase.from("accuracy_tests").insert(data).select().single();
    if (error) {
        console.error("Error creating accuracy tests:", error);
    };
};

// save image thru arrayBuffer
export async function uploadImage(uri: string): Promise<string | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.id) {
            console.log("No user found — not authenticated");
            return null;
        }

        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();

        // detect file type
        const isPng = uri.toLowerCase().endsWith(".png");
        const contentType = isPng ? "image/png" : "image/jpeg";
        const extension = isPng ? "png" : "jpg";

        const fileName = `${user.id}/image_${Date.now()}.${extension}`;

        const { error } = await supabase.storage
            .from("images")
            .upload(fileName, arrayBuffer, {
                contentType: contentType,
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);

        return data.publicUrl

    } catch (err) {
        console.error(err);
        return null;
    };
};

export async function getImageUrl(filePath: string): Promise<string | null> {
    const path = filePath.replace(
        /^.+\/storage\/v1\/object\/public\/images\//,
        ""
    );

    const { data, error } = await supabase.storage
        .from("images")
        .createSignedUrl(path, 60 * 60); // 1 hour

    if (error) {
        console.error("Error creating signed URL:", error);
        return null;
    }

    return data.signedUrl;
}