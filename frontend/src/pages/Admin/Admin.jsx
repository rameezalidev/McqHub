import React, { use, useEffect, useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Admin() {
    const [catName, setCatName] = useState("")
    const token = localStorage.getItem('token');
    const [categories, setCategories] = useState('');
    async function addCategory() {
        const response = await fetch(`${API_URL}/api/admin/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name: catName })
        });
        const data = await response.json();
        console.log(data)
    }
    function helperFunc() {
        addCategory()
        setCatName("");
    }

    async function handleCategoryDelete(id) {
        const response = await fetch(`${API_URL}/api/admin/categories/${id}`,{
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data);
    }
    function helperDel(id) {handleCategoryDelete(id)}
    useEffect(() => {
        async function getCategories() {
            try {
                const response = await fetch(`${API_URL}/api/users/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setCategories(data.data || []);
            } catch (error) {
                console.error(error);
            }
        }
        getCategories();
    }, [])

    useEffect(()=>{
        console.log(categories)
    },[categories])
    return (
        <div>
            <input type="text" placeholder="type name of category" onChange={(e) => setCatName(e.target.value)} />
            <button onClick={() => helperFunc()}>Add Categories</button>
            {
                categories &&
                <div>
                    {categories.map(el=>{
                        return <>
                        <p>{el.name}</p>
                        <button onClick={()=>helperDel(el._id)}>Delete</button>
                        </>

                    })}
                </div>
            }

        </div>
    )
}

export default Admin