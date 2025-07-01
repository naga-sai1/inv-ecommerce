import { supabase } from "./supabase";

export class StorageService {
  private bucketName = "inv-ecommerce-image"; 

  /**
   * Upload an image file to Supabase Storage
   */
  async uploadImage(
    file: File,
    path?: string
  ): Promise<{ url: string; path: string } | null> {
    try {
      // Generate unique filename if path not provided
      const fileExtension = file.name.split(".").pop();
      const fileName =
        path ||
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExtension}`;
      const filePath = `products/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        return null;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(this.bucketName).getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: File[]
  ): Promise<Array<{ url: string; path: string }>> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((result) => result !== null) as Array<{
      url: string;
      path: string;
    }>;
  }

  /**
   * Delete an image from storage
   */
  async deleteImage(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([path]);

      if (error) {
        console.error("Delete error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  }

  /**
   * Get public URL for an image
   */
  getPublicUrl(path: string): string {
    const {
      data: { publicUrl },
    } = supabase.storage.from(this.bucketName).getPublicUrl(path);
    return publicUrl;
  }

  /**
   * List all images in a folder
   */
  async listImages(folder = "products"): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(folder);

      if (error) {
        console.error("List error:", error);
        return [];
      }

      return data?.map((file) => `${folder}/${file.name}`) || [];
    } catch (error) {
      console.error("Error listing images:", error);
      return [];
    }
  }

  /**
   * Check if bucket exists and create if needed
   */
  async ensureBucketExists(): Promise<boolean> {
    try {
      // Try to list files in bucket
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list();

      if (error && error.message.includes("Bucket not found")) {
        console.log(
          "Bucket does not exist, please create it in Supabase dashboard"
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking bucket:", error);
      return false;
    }
  }
}

export const storageService = new StorageService();
