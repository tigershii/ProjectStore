"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { createItem, getPresignedUrls, sendToS3 } from "@/lib/api/items";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const categories = [
  "Home",
  "Electronics",
  "Fashion",
  "Food",
  "Books",
  "Toys",
  "Sports",
  "Other"
];

export default function CreateItemMenu() {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        images: [] as string[]
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        })
    }

    const handleCategoryChange = (value: string) => {
      setFormData({
        ...formData,
        category: value
      }); 
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        setImageFiles(files);
      }
    }

    const handleSubmit = async() => {
      try {
        if (!formData.name || !formData.price) {
          alert("Please fill in all required fields");
          return;
        }
        setIsLoading(true);
        let uploadedImageUrls = [];
        if (imageFiles.length > 0) {
          const fileTypes = imageFiles.map(file => file.type);
          const presignedUrlData = await getPresignedUrls(imageFiles.length, fileTypes);

          const uploadPromises = imageFiles.map(async (file, index) => {
            const presignedUrl = presignedUrlData.urls[index];
            const s3Url = presignedUrlData.s3Urls[index];

            await sendToS3(presignedUrl, file);
            return s3Url;
          });
          uploadedImageUrls = await Promise.all(uploadPromises);
          console.log("Uploaded image URLs:", uploadedImageUrls);
        }
        const newItem = {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          images: uploadedImageUrls
        }
        await createItem(newItem);
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          images: []
        })
        setImageFiles([]);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        setIsDialogOpen(false);
        
      } catch (error) {
        console.error(error);
      } finally {
        router.refresh();
        setIsLoading(false);
      }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Item</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Item Name
              </Label>
              <Input id="name" required className="col-span-3" onChange={handleInputChange} value={formData.name}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Price
              </Label>
              <Input id="price" className="col-span-3" onChange={handleInputChange} value={formData.price}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Description
              </Label>
              <Input id="description" className="col-span-3" onChange={handleInputChange} value={formData.description}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue>{formData.category || "Select a category"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Images
              </Label>
              <Input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                multiple 
                className="col-span-3" 
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="text-white dark:text-black"
            >
              {isLoading ? 'Uploading...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}