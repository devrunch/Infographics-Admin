import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';

const Infographics = () => {
    const [infographics, setInfographics] = useState([]);
    const [editingInfographic, setEditingInfographic] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', tags: [] });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [tags, setTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([])
    const [searchParams, setSearchParams] = useState({ description: '', tag: '', page: 1 });
    const [searchTags, setSearchTags] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        fetchInfographics();
        fetch('https://utility.caclouddesk.com/api/infographics/tags')
            .then((response) => response.json())
            .then((data) => {
                setAvailableTags(data.map((tag) => ({ value: tag, label: tag })));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleTagsChange = (newValue) => {
        setTags(newValue);
        console.log(newValue)
        setFormData({ ...formData, tags: newValue.map((tag) => tag.value )});
    };
    const fetchInfographics = async () => {
        try {
            const { description, tag, page } = searchParams;
            const response = await fetch(`https://utility.caclouddesk.com/api/infographics/search?description=${description}&tag=${tag}&page=${page}&limit=10`);
            const data = await response.json();
            // console.log(data.infographics[0].tags)
            setInfographics(data.infographics);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching infographics:', error);
        }
    };

    const handleEdit = (infographic) => {
        setEditingInfographic(infographic);
        setFormData({ title: infographic.title, description: infographic.description, tags: infographic.tags });
        setImagePreview(`https://utility.caclouddesk.com/uploads/${infographic.image}`);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://utility.caclouddesk.com/api/infographics/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Infographic deleted successfully');
            }
            fetchInfographics();
        } catch (error) {
            console.error('Error deleting infographic:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const raw = JSON.stringify({
            "title": formData.title,
            "description": formData.description,
            "tags": formData.tags,
          });
        try {
            const response = await fetch(`https://utility.caclouddesk.com/api/infographics/${editingInfographic._id}`, {
                method: 'POST', // Use PUT or PATCH for updating
                body: raw,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Check if the response is OK (status 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
            setEditingInfographic(null);
            toast.success('Infographic updated successfully');
            setFormData({ title: '', description: '', tags: [] });
            setImage(null);
            setImagePreview(null);
            fetchInfographics();
        } catch (error) {
            console.error('Error updating infographic:', error);
            toast.error('Failed to update infographic');
        }
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ ...searchParams, page: newPage });
    };

    return (
        <div className="container m-auto py-5 bg-white rounded-md w-[97%] shadow-2xl ">
            <h1 className="text-2xl font-bold mb-4 text-center text-[#31AACC]">Infographics</h1>
            <div className="mb-4 mx-12 flex items-center justify-around w-11/12">
                <input
                    type="text"
                    placeholder="Search by description"
                    name="description"
                    value={searchParams.description}
                    onChange={handleSearchChange}
                    className="border p-2 rounded-md w-5/12 mb-2"
                />
                <CreatableSelect
                    options={[{label:"None",value:""},...availableTags]}
                    placeholder="Search by tags"
                    onChange={(selectedTags) => {console.log(selectedTags); setSearchTags(searchTags); handleSearchChange({ target: { name: 'tag', value: selectedTags.value } })}}
                    className="border rounded-md p-2 w-4/12 mb-2"
                />
                <button
                    onClick={() => fetchInfographics()}
                    className="w-2/12 bg-blue-500 text-white p-2 rounded-md"
                >
                    Search
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mx-12 w-11/12">
                {infographics.map((infographic) => (
                    <div key={infographic._id} className="p-4 border rounded-md shadow-md flex flex-col justify-stretch items-start">
                        <img src={`https://utility.caclouddesk.com/uploads/${infographic.image}`} alt={infographic.title} className="h-48 m-auto mb-2 object-contain justify-self-start" />
                        <h2 className="text-xl font-semibold">{infographic.title}</h2>
                        <p>{infographic.description}</p>
                        <p className="text-sm text-gray-600 uppercase">{infographic.tags.join(' ')}</p>
                        <div className="flex space-x-2 mt-2">
                            <button onClick={() => handleEdit(infographic)} className="px-4 py-2 bg-[#31AACC] text-white rounded-md">Edit</button>
                            <button onClick={() => handleDelete(infographic._id)} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {editingInfographic && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4">Edit Infographic</h2>
                        <form onSubmit={handleUpdate} className="flex space-y-4">
                            <div className='w-1/2 flex flex-col justify-around '>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        className="border rounded-md p-2"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                                    <textarea
                                        id="description"
                                        className="border rounded-md p-2"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="tags" className="text-sm font-medium">Categories</label>
                                    <CreatableSelect
                                        isMulti
                                        options={availableTags || []}
                                        value={formData.tags.map((tag) => ({ value: tag, label: tag }))}
                                        onChange={handleTagsChange}
                                        className="border rounded-md p-2"
                                        name='tags'
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded-md"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingInfographic(null)}
                                    className="w-full bg-gray-500 text-white p-2 rounded-md mt-2"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div>


                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-center">Upload Image</label>
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        className="border-dashed border-2 h-96 m-10 flex flex-col justify-center items-center border-gray-300 rounded-md p-4 cursor-pointer"
                                    >
                                        {!imagePreview ? (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    name='image'
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="imageUpload"
                                                />
                                                <label htmlFor="imageUpload" className="block text-center">
                                                    Drag & drop or click to upload
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="m-auto overflow-hidden">
                                                <img src={imagePreview} alt="Preview" className="h-full object-cover rounded-md" />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="font-bold w-full my-3 bg-blue-500 text-white p-1 rounded-full"
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Infographics;
