import {useProductStore} from "../store/useProductStore.js";

export const useSaveProduct = ()=>{
    const createProduct = useProductStore((state)=> state.createProduct);
    const updateProduct = useProductStore((state)=>state.updateProduct);

    const saveProduct = async(data , productId = null)=>{
        const payload = {
            name: data.name,
            description: data.description,
            type: data.type,
            price:Number(data.price)
        };

        if (productId) {
            await updateProduct(productId, payload);
        } else {
            await createProduct(payload);
        }
    };
    return{saveProduct};
};