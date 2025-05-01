import {create} from 'zustand';
import axiosInstance from '../lib/axios';
import {toast} from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = 'http://localhost:5001';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    async checkAuth() {
        try {
            const response = await axiosInstance.get('/auth/check');
            set({authUser: response.data});
            get().connectSocket();
            // get()方法可以获取store中的数据
        } catch (error) {
            set({authUser: null});
            console.log("Error in checkAuth", error.message);
        } finally {
            set({isCheckingAuth: false});
        }
    },

    async signup(data) {
        set({isSigningUp: true});
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({authUser: response.data});
            toast.success('用户创建成功');
        } catch (e) {
            toast.error("用户创建失败");
            console.error('error in signup', e);
        } finally {
            set({isSigningUp:false});
        }
    },
    async logout() {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success('用户已经登出');
            get().disconnectSocket();
        } catch (e) {
            toast.error("登出失败");
            console.error('error happens in logout', e);
        }
    },
    async login(data) {
        set({isLoggingIn:true});
        try {
            const response = await axiosInstance.post('auth/login', data)
            set({authUser:response.data});
            toast.success('用户登陆成功');
            get().connectSocket();
        } catch (e) {
            toast.error(e.response.data.message);
        } finally {
            set({isLoggingIn:false});
        }
    },
    async updateProfile(data) {
        set({isUpdatingProfile:true});
        try {
            const response = await axiosInstance.put('/auth/update-profile',data);
            set({authUser:response.data});
            toast('更换头像成功');
        } catch (e) {
            toast("更换头像失败");
            console.error('error happens in updateProfile', e);
        } finally {
            set({isUpdatingProfile:false})
        }
    },

    connectSocket() {
        const {authUser} =  get();
        if (!authUser || get().socket?.connected) return;

        const newSocket = io(BASE_URL, {
            query:{
                userId: authUser._id,
            }
        });
        newSocket.connect();
        set({socket:newSocket});

        // 获取广播信息
        newSocket.on('getOnlineUsers', (userIds)=> {
            set({onlineUsers:userIds});
        })
    },
    disconnectSocket() {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },
}))