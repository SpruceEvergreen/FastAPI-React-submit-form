import React from "react";
import { useForm, SubmitHandler  } from "react-hook-form"
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const MAX_FILE_SIZE = 1024 * 1024 * 2;

const imageSchema = z.any().optional()
  .refine(file => file.length == 1 ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) ? true : false : true, 'Изображение должно быть формата JPEG или PNG.')
  .refine(file => file.length == 1 ? file[0]?.size <= MAX_FILE_SIZE ? true : false : true, 'Размер изображения не должен превышать 2MB.')

export const FormSchema = z.object({
      firstName: z.string({message: "Данное поле обязательно к заполнению."}).min(3, { message: "Имя должно содержать не меньше 3 символов." }).max(30, { message: "Имя должно содержать не больше 30 символов." }),
      lastName: z.string({message: "Данное поле обязательно к заполнению."}).min(3, { message: "Фамилия должна содержать не меньше 3 символов." }).max(30, { message: "Фамилия должна содержать не больше 30 символов." }),
      email: z.string({message: "Данное поле обязательно к заполнению."}).email({ message: "E-Mail адрес введён неверно." }).regex(/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i),
      category: z.enum([
          "option1",
          "option2",
          "option3"
        ], {
      errorMap: () => ({ message: "Пожалуйста, выберете категорию." })
      }),
      description: z.string({message: "Данное поле обязательно к заполнению."}).min(10, { message: "Длина текста должна содержать не меньше 10 символов." }).max(500, { message: "Длина текста должна содержать не больше 800 символов." }),
      file_upload: imageSchema.nullish(),
})


type IFormInput = z.infer<typeof FormSchema>;

export default function App() {
  const { 
    register,
    formState: { errors },
    formState, 
    handleSubmit, 
    reset
  } = useForm<IFormInput>({resolver: zodResolver(FormSchema), mode: "onChange"})


    const [file, setFile] = useState<any>();

    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.error("Выберете файл");
            return;
        }

        setFile(e.target.files[0]);
    };

    const handleFileRemove = () => {
        const input = document.getElementById("input-file");
            if (input) setFile(null);
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {            
            const formData = new FormData();
            formData.append('file_upload', file);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            formData.append("category", data.category);
            formData.append("description", data.description);
            JSON.stringify(formData)
            console.log(formData)

            // sending to backend
            try {
                const endpoint = "http://localhost:8080/uploadfile/"
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    console.log("Form submitted sucessfully!")
                    
                } else {
                    console.error("Failed to submit form.");
                }
            } catch(error) {
                console.error(error);
            }

    }

    React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ firstName: "" })
      reset({ lastName: "" })
      reset({ email: "" })
      reset({ category: undefined })
      reset({ description: "" })
      reset({ file_upload: null })
      setFile(null)
    }
    }, [formState, FormData, reset])

  return (  
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form__container"> 
        <h1 className="contact-form__title">Написать нам</h1>

         <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="firstName">Имя</label>
            <input className="contact-form__input" {...register("firstName")} id="firstName"
            />
            {errors.firstName && (
                <p style={{ color: "red" }}>{errors.firstName.message}</p>
            )}
        </div>
        
        <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="lastName">Фамилия</label>
            <input className="contact-form__input" {...register("lastName")} id="firstName"
            />
            {errors.lastName && (
                <p style={{ color: "red" }}>{errors.lastName.message}</p>
            )}
        </div>
        
        <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="email">E-Mail адрес</label>
            <input className="contact-form__input" type="email" {...register("email")} id="firstName"
            />
            {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
        </div>

         <div className="contact-form__field">
             <label className="contact-form__label" htmlFor="category">Пожалуйста, выберете категорию сообщения</label>
             <select className="contact-form__select" {...register("category")} id="category">
                 <option value="">Категория сообщения</option>
                 <option value="option1">Категория 1</option>
                 <option value="option2">Категория 2</option>
                 <option value="option3">Категория 3</option>
             </select>
             {errors.category && (
                <p style={{ color: "red" }}>{errors.category.message}</p>
            )}
        </div>

        <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="description">Ваше сообщение</label>
            <textarea className="contact-form__textarea" {...register("description")} id="description" rows={10}
            />
            {errors.description && (
                <p style={{ color: "red" }}>{errors.description.message}</p>
            )}
        </div> 
         
        <div className="contact-form__input-field">
            <div className="contact-form__wrapper">
                <label className="contact-form__label" htmlFor="input-file">Загрузить изображение</label> 
                {file?.name && <p className="contact-form__text">Изображение {file?.name} загружено</p>} 
                {file?.name && (
                  <button
                    type="button"
                    className="contact-form__delete-button"
                    onClick={handleFileRemove}
                  >
                      <span className="contact-form__delete-button-text">Удалить изображение</span>
                  </button>
                )}
            </div>

            <input
                type="file"
                id="input-file"
                className="contact-form__input-file"
                style={{ opacity: 0 }}
                {...register("file_upload")}
                onChange={onFileChange}  
            />

        </div>
        {errors.file_upload && <p style={{ color: "red" }}>{errors.file_upload?.message?.toString()}</p>}

        <button className="contact-form__submit" id="submitBtn">
            <span className="contact-form__submit-text">Отправить сообщение</span>
        </button>
    </form>
  )
}

