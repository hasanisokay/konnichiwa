'use client'
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import SpeakerIcon from '../svg/SpeakerIcon';
import speakWord from '@/utils/speakWord.mjs';
import LessonFilter from '../sort/LessonFilter';
import SearchBox from '../search/SearchBox';
import LessonSelector from '../selects/LessonSelector';

const AdminVocabularyList = ({ v }) => {
  const [vocabularies, setVocabularies] = useState(v);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVocabulary, setSelectedVocabulary] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vocabularyToDelete, setVocabularyToDelete] = useState(null);
  const handleEdit = (vocabulary) => {
    setSelectedVocabulary({ ...vocabulary });
    setIsEditing(true);
  };
  useEffect(() => {
    setVocabularies(v)
  }, [v])
  const memorizedVocabularies = useMemo(() => vocabularies, [vocabularies]);
  const handleDelete = async (vocabularyId) => {
    const res = await fetch(`/api/deletes/delete-vocabulary`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ vocabularyId })
    });
    const data = await res.json();

    if (data?.status === 200) {
      toast.success('Vocabulary deleted successfully', {
        position: 'top-center',
        autoClose: 1500,
      });
      setVocabularies(vocabularies.filter((vocab) => vocab._id !== vocabularyId));
    } else {
      toast.error(data?.message || 'Error deleting vocabulary', {
        position: 'top-center',
        autoClose: 1500,
      });
    }

    setIsDeleteModalOpen(false);
    setVocabularyToDelete(null);
  };

  const handleOpenDeleteModal = (vocabulary) => {
    setVocabularyToDelete(vocabulary);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setVocabularyToDelete(null);
  };

  const handleSaveEdit = async () => {
    const res = await fetch(`/api/puts/edit-vocabulary`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedVocabulary),
    });
    const data = await res.json();

    if (data?.status === 200) {
      toast.success('Vocabulary updated successfully', {
        position: 'top-center',
        autoClose: 1500,
      });
      // Update the vocabularies in state
      setVocabularies((prevVocab) =>
        prevVocab.map((vocab) =>
          vocab._id === selectedVocabulary._id ? selectedVocabulary : vocab
        )
      );
    } else {
      toast.error(data?.message || 'Error updating vocabulary', {
        position: 'top-center',
        autoClose: 1500,
      });
    }
    setIsEditing(false);
    setSelectedVocabulary(null);
  };

  return (
    <div className="bg-gray-100 md:p-6 p-4">
      <SearchBox placeholder={'Search with word or meaning'} />
      <LessonFilter />
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Vocabulary List</h1>
      {memorizedVocabularies?.length === 0 ? (
        <p className="text-gray-500 text-center">No vocabulary found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memorizedVocabularies.map((vocabulary) => (
            <div
              key={vocabulary._id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div className='space-y-2'>
                <h2
                  className="text-lg font-semibold break-words text-gray-800 mb-2"
                  title={vocabulary.word}
                >
                  {vocabulary.word}
                  <SpeakerIcon
                    clickHandler={() => speakWord(vocabulary.word)}
                  />
                </h2>
                <p className="text-gray-600" >
                  <span className="font-medium">Meaning:</span> {vocabulary.meaning}
                  <SpeakerIcon
                    clickHandler={() => speakWord(vocabulary.meaning, 'en-US')}
                  />
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Pronunciation:</span> {vocabulary.pronunciation}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">When to Say:</span> {vocabulary.whenToSay}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Lesson No:</span> {vocabulary.lessonNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Added by:</span> {vocabulary.adminEmail}
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-blue-600"
                  onClick={() => handleEdit(vocabulary)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-red-600"
                  onClick={() => handleOpenDeleteModal(vocabulary)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedVocabulary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md h-auto md:h-[calc(100vh-100px)] mt-10 overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setIsEditing(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-lg font-bold mb-4">Edit Vocabulary</h2>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Word</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={selectedVocabulary.word}
                  onChange={(e) =>
                    setSelectedVocabulary({ ...selectedVocabulary, word: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <SpeakerIcon
                  clickHandler={() => speakWord(selectedVocabulary.word)}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Meaning</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={selectedVocabulary.meaning}
                  onChange={(e) =>
                    setSelectedVocabulary({ ...selectedVocabulary, meaning: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
                <SpeakerIcon
                  clickHandler={() => speakWord(selectedVocabulary.meaning, 'en-US')} />
              </div>

            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Pronunciation</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={selectedVocabulary.pronunciation}
                  onChange={(e) =>
                    setSelectedVocabulary({ ...selectedVocabulary, pronunciation: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />

              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">When to Say</label>
              <textarea
                value={selectedVocabulary.whenToSay}
                onChange={(e) =>
                  setSelectedVocabulary({ ...selectedVocabulary, whenToSay: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Lesson No</label>
              <LessonSelector changeHandler={(e) =>
                  setSelectedVocabulary({ ...selectedVocabulary, lessonNumber: e.value })} />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && vocabularyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-center">Are you sure you want to delete this vocabulary?</h2>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleDelete(vocabularyToDelete._id)}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={handleCloseDeleteModal}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVocabularyList;
