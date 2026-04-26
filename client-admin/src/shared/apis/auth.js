import {axiosAuth} from "./api.js";

export const login = async(data)=>{
    return await axiosAuth.post('/auth/login', data);
}

export const lostPassword = async(data)=>{
    return await axiosAuth.post('/auth/forgot-password', data);
}

export const resetPassword = async (data)=>{
    return await axiosAuth.post('/auth/reset-password', data);
}

export const activateUser = async(data)=>{
    return await axiosAuth.post('/auth/verify-email', data);
}

export const changeTempPassword = async(data)=>{
    return await axiosAuth.post('/auth/change-temp-password', data);
}