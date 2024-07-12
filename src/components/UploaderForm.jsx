import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';

const ImageUploadForm = () => {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const [availableTags,setAvailableTags] = useState([])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleTagsChange = (newValue) => {
        setTags(newValue);
    };
    useEffect(() => {
        fetch('https://utility.caclouddesk.com/infographics/tags')
        .then((response) => response.json())
        .then((data) => {
            console.log(data.map((tag) => ({ value: tag, label: tag })))
            setAvailableTags(data.map((tag) => ({ value: tag, label: tag })));
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    },[]);
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags.map(tag => tag.value).join(','));

        fetch('https://utility.caclouddesk.com/infographics/upload', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            toast.success('Infographic uploaded successfully');
            setImage(null);
            setTitle('');
            setDescription('');
            setTags([]);
            setLoading(false);
        })
        .then(() => window.location.reload())
        .catch((error) => {
            setLoading(false);
            toast.error('Error uploading infographic');
            console.error('Error:', error);
        });
    };

    return (
        <div className="m-6 p-4 bg-white rounded-md shadow-md">
            <form onSubmit={handleSubmit} className="flex justify-center items-center max-h-[90vh]">
                <div className='w-1/2'>
                    <div className="flex flex-col space-y-2">
                        <label className="text-xl font-medium ml-10 uppercase text-[#31AACC]">Upload Infographics </label>
                        {!image ? (
                            <div className="border-dashed border-2 h-96 m-10 flex flex-col justify-center items-center border-gray-300 rounded-md p-4 cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    name='image'
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label htmlFor="imageUpload" className="block text-center bg-cyan-600 text-white p-5 rounded-3xl">
                                    Drag & drop or click to upload
                                </label>
                            </div>
                        ) : (
                            <div className="relative m-auto">
                                <img src={image} alt="Preview" className="w-96 rounded-md" />
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
                <div className='w-1/2 space-y-3'>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="border rounded-md p-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            name='title'
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <textarea
                            id="description"
                            className="border rounded-md p-2"
                            name='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="tags" className="text-sm font-medium">Tags</label>
                        <CreatableSelect
                            isMulti
                            options={availableTags || []}
                            value={tags}
                            onChange={handleTagsChange}
                            className="border rounded-md p-2"
                            name='tags'
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-[#31AACC] text-white p-2 rounded-md` + (loading ? ' opacity-50 cursor-not-allowed' : '')}
                        disabled={loading}
                    >
                        Submit
                    </button>
                </div>  
            </form>
        </div>
    );
};

export default ImageUploadForm;
