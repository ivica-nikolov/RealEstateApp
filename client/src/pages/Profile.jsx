import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import {Link} from 'react-router-dom';
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFail, deleteUserFail, deleteUserStart, deleteUserSuccess, signOutStart, signInStart, signOutFail, signOutSuccess } from "../redux/User/userSlice";



export default function Profile() {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state => state.user));
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUpploadError] = useState(false);
    const [formData , setFormData] = useState({})

    useEffect(() => {
        if(file){
            handleFileUpload(file);
        }
    }, [file])

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / 
            snapshot.totalBytes) * 100;
            setFilePerc(math.round(progress))
        },
        (error) => {
            setFileUpploadError(true);
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then
            ((downloadURL) =>  {
                setFormData({ ...formData , avatar: downloadURL });

            })
        });
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id] : e.target.value})
    }

    const handleSubmit = async () => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:  JSON.stringify(formData)
            });
            const data = await res.json();
            if(data.success === false) {
                dispatch(updateUserFail(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
        } catch (error) {
            dispatch(updateUserFail(error.message));
        }
    }

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}` , {
                method: 'DELTE',
            });
            const data = await res.json();
            if(data.success === false){
                dispatch(deleteUserFail(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFail(error.message))
        }
    }

    const handleSignOut = async () => {
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if(data.success === false ){
                dispatch(signOutFail(data.message));
                return;
            }
            dispatch(signOutSuccess(data));
        } catch (error) {
            dispatch(signOutFail(error.message))
        }
    }


    return(
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>

                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>

                <p className="text-sm self-center">
                    {fileUploadError ? 
                    (<span className="rexr-red-700">Error image upload</span>) :
                    filePerc > 0 && filePerc< 100 ? (
                    <span className="text-green-700">
                        {`Uploading ${filePerc}%`}
                    </span>)
                    : filePerc === 100 ? (
                        <span className="text-green-700">Image successfully uploaded!</span>
                    ) : ("")
                    }
                </p>
                <input type="text" placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rouded-lg" onChange={handleChange}/>
                <input type="email" placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3 rouded-lg" onChange={handleChange}/>
                <input type="password" placeholder="password" id="password" className="border p-3 rouded-lg" onChange={handleChange}/>
                <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabeld:opacity-80" >{loading ? 'Loading.. ' : 'Update'}</button>

                <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'}> Create listing
                </Link>

                
            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
                <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Sign Out</span>
            </div>
            <p className="text-red-700 mt-5">
                {error ? error : ''}
            </p>
        </div>
    )
}