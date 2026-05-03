import {axiosAuth} from "./api.js";

export const login = async(data)=>{
    return await axiosAuth.post('/auth/login', data);
}

export const lostPassword = async({email})=>{
    return await axiosAuth.post('/auth/forgot-password', {email});
}

export const resetPassword = async ({token, NewPassword})=>{
    return await axiosAuth.post('/auth/reset-password', {token, NewPassword});
}

export const activateUser = async({token})=>{
    return await axiosAuth.post('/auth/verify-email', {token});
}

export const changeTempPassword = async({NewPassword})=>{
    return await axiosAuth.post('/auth/change-temp-password', {NewPassword});
}