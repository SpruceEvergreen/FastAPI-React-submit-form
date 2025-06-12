from fastapi import FastAPI, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import uvicorn


UPLOAD_DIR = Path() / 'backend-fastapi/uploads'

app = FastAPI()

origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:3001",
    "https://localhost:3001",
    "http://localhost:8080",
    "https://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MyFormData(BaseModel):
    firstName: str = Form(...)
    lastName: str = Form(...)
    email: str = Form(...)
    category: str = Form(...)
    description: str = Form(...)
    file_upload: UploadFile | str 



@app.post("/uploadfile/")
async def upload_file(submitted_data: MyFormData = Form(...)):
    if type(submitted_data.file_upload) != str:
        data = await submitted_data.file_upload.read()
        save_to = UPLOAD_DIR / submitted_data.file_upload.filename
        with open(save_to, 'wb') as f:
            f.write(data)

    if type(submitted_data.file_upload) == str:
        file_upload_name = submitted_data.file_upload
    else:
        file_upload_name = submitted_data.file_upload.filename
    my_data = {
        "firstName": submitted_data.firstName,
        "lastName": submitted_data.lastName,
        "email": submitted_data.email,
        "category": submitted_data.category,
        "description": submitted_data.description,
        "file_upload": file_upload_name,
    }

    with open("./backend-fastapi/uploads/newdemofile.txt", "a") as f:
        for item in my_data:
            f.write(my_data[item])
            f.write("\n")
        f.write("\n")

    return my_data

if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')