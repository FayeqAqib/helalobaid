import { deleteAccountAction } from "@/actions/accountAction";
import { deleteProductAction } from "@/actions/productAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ConfirmDelete({ children, data, open, onOpen }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductAction(data._id); // or whatever your delete logic is

      if (result.result?.message) return toast.warning(result.result?.message);
      if (!result.err) {
        toast.success("محصول شما با موفقیت حذف شد");
      } else {
        toast.error(
          "در حذف محصول شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
      onOpen(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}

      <DialogContent className=" flex flex-col text-right items-start">
        <DialogHeader className=" flex flex-col t items-start">
          <DialogTitle>حذف محصول</DialogTitle>
          <DialogDescription className={"text-right"}>
            آیا مطمئن هستید اطلاعات محصول با نام {data.name} را حذف کنید؟.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className={"w-full"}>
          <DialogClose asChild>
            <Button onClick={handleDelete}>
              {isPending ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                "مطمئن استم"
              )}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"outline"}>انصراف</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
