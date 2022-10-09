import { useEffect, useState } from "react"

export default function SelectCategory({id, onChange}){
    const [dataCategory, setDataCategory] = useState([]);
    const [fetchCategoryStatus, setFetchCategoryStatus] = useState(false);
    const isEditMode = id !== -1;

    useEffect(() => {
        (async () => {
            setFetchCategoryStatus(true);
            try {
                const res = await fetch(`https://service-example.sanbercloud.com/api/category`);
                const data = await res.json();
                if(data){
                    setDataCategory(data);
                }
                setFetchCategoryStatus(false);
            } catch (error) {
                alert(error);
                setFetchCategoryStatus(false);
            }
        })();
    }, []);

    return (
        <label className="text-gray-700" htmlFor="category">
            <select id="category" 
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
            name="id_category" 
            disabled={fetchCategoryStatus}
            onChange={onChange} >
                <option value="-1" selected={!isEditMode}>
                    {fetchCategoryStatus ? 'Loading...' : dataCategory.length > 0 ? 'Category' : 'Data not found'}
                </option>
                {dataCategory.length > 0 && dataCategory
                .map(category => (
                    <option value={category.id} key={category.id} selected={isEditMode && id === category.id}>
                        {category.category_name}
                    </option>
                ))}
            </select>
      </label>
    )
}