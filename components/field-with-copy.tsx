import {Copy} from "lucide-react";
import {useToast} from "@/hooks/use-toast";

interface FieldWithCopyProps {
  textToCopy: string
}

export function FieldWithCopy({textToCopy}: FieldWithCopyProps) {
  const {toast} = useToast();
  return (
    <div className="relative flex justify-between items-center">
      {textToCopy}
      <button className="p-0 m-0 border-none bg-transparent cursor-pointer"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(textToCopy);
                  toast({
                    title: "Скопировано!", // Заголовок тоста
                    description: `ID "${textToCopy}" успешно скопирован в буфер обмена.`, // Описание
                    // variant: "default", // Можно указать вариант стиля, если они определены (например, "destructive")
                  });
                } catch (err) {
                  toast({
                    title: "Ошибка копирования",
                    description: "Не удалось скопировать ID. Пожалуйста, попробуйте еще раз.",
                    variant: "destructive", // Если у вас определён стиль для ошибок
                  });
                }
              }}>
        <Copy size={16}/></button>
    </div>
  )
}