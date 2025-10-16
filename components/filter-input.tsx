// components/FilterInput.tsx
import {Input} from "@/components/ui/input";
import {X} from "lucide-react";

interface FilterInputProps {
  value: string; // Значение инпута
  onChange: (value: string) => void; // Функция для изменения значения
  placeholder?: string; // Опциональный placeholder
  label?: string; // Опциональный лейбл
  // Можно добавить другие пропсы, например, className для стилизации
}

export function FilterInput({value, onChange, placeholder, label}: FilterInputProps) {

  const handleClear = () => {
    onChange(""); // Очищаем значение через переданную функцию
  };

  return (
    <div className="space-y-2">
      {label && <div>{label}</div>} {/* Рендерим лейбл, если он передан */}
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)} // Передаём новое значение
          className="h-8 pr-8" // Добавим pr-8 для места под кнопку
        />
        {value && value !== "" && ( // Показываем кнопку только если есть значение
          <button
            type="button" // Важно: type="button", чтобы не сабмитить форму
            className="absolute right-1 top-1/2 h-6 w-6 flex items-center justify-center rounded-full -translate-y-1/2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleClear} // Используем внутреннюю функцию для очистки
            aria-label="Очистить фильтр"
          >
            <X size={16}/> {/* Уменьшил size, 48 пикселей слишком много для 8px инпута */}
          </button>
        )}
      </div>
    </div>
  )
}