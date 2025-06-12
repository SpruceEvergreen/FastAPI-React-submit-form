import React from "react";
import { useForm, SubmitHandler  } from "react-hook-form"
import { useState } from "react";


const MAX_FILE_SIZE = 1024 * 1024 * 2;

enum OptionEnum {
  option1 = "Категория 1",
  option2 = "Категория 2",
  option3 = "Категория 3",
}

interface IFormInput {
    firstName: string
    lastName: string
    email: string
    category: OptionEnum
    description: string
    file_upload?: File | null
}

export default function App() {
  const { 
    register,
    formState, 
    handleSubmit,
    reset, 
    setValue
  } = useForm<IFormInput>({ mode: "onChange"})

    const [file, setFile] = useState<any>();

    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.error("Выберете файл");
            return;
        }

        if (e.target.files[0].size > MAX_FILE_SIZE ) {
            alert("Размер изображения не должен превышать 2MB.");
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

            // для последующей отправки формы на бекенд
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
                required
                minLength={3}
                maxLength={30}
            />
        </div>
        
        <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="lastName">Фамилия</label>
            <input className="contact-form__input" {...register("lastName")} id="firstName"
                required
                minLength={3}
                maxLength={30}
            />
        </div>
        
        <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="email">E-Mail адрес</label>
            <input className="contact-form__input" type="email" {...register("email")} id="firstName"
                required/>
        </div>

         <div className="contact-form__field">
             <label className="contact-form__label" htmlFor="category">Пожалуйста, выберете категорию сообщения</label>
             <select className="contact-form__select" {...register("category")} id="category" required>
                 <option value="">Категория сообщения</option>
                 <option value="option1">Категория 1</option>
                 <option value="option2">Категория 2</option>
                 <option value="option3">Категория 3</option>
             </select>
        </div>

        <div className="contact-form__field">
            <label className="contact-form__label" htmlFor="description">Ваше сообщение</label>
            <textarea className="contact-form__textarea" {...register("description")} id="description" rows={10}
            required
            minLength={10}
            maxLength={800}
            />
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
                accept="image/png, image/jpeg"
                {...register("file_upload")}
                onChange={onFileChange}
            />


        </div>
        <div>

        </div>
        <button className="contact-form__submit" id="submitBtn">
            <span className="contact-form__submit-text">Отправить сообщение</span>
        </button>
    </form>
  )
}

