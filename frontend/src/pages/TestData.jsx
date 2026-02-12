import { mcqData, descriptiveData } from '../data/index'

export default function TestData() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">MCQ Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(Object.keys(mcqData), null, 2)}
        </pre>
        <p className="mt-2">Total subjects: {Object.keys(mcqData).length}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Descriptive Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(Object.keys(descriptiveData), null, 2)}
        </pre>
        <p className="mt-2">Total subjects: {Object.keys(descriptiveData).length}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">History MCQs:</h2>
        <p>Total questions: {mcqData['History']?.length || 0}</p>
        {mcqData['History']?.[0] && (
          <div className="bg-blue-50 p-4 rounded mt-2">
            <p className="font-semibold">First Question:</p>
            <p>{mcqData['History'][0].question}</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">History Descriptive:</h2>
        <p>Total questions: {descriptiveData['History']?.length || 0}</p>
        {descriptiveData['History']?.[0] && (
          <div className="bg-green-50 p-4 rounded mt-2">
            <p className="font-semibold">First Question:</p>
            <p>{descriptiveData['History'][0].question}</p>
          </div>
        )}
      </div>
    </div>
  )
}
