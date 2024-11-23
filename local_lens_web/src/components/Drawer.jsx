import { auth } from "../firebase-config";


function Drawer({ isOpen, onClose, setUser }) {
    return (
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul>
            <li className="mb-2">
              <button className="text-blue-500">Home</button>
            </li>
            <li className="mb-2">
              <button className="text-blue-500">Profile</button>
            </li>
            <li className="mb-2">
              <button className="text-blue-500">Settings</button>
            </li>
          </ul>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <button
          className="absolute bottom-1 right-2 text-red-400 underline font-semibold"
          onClick={() => {
            auth.signOut();
          }}
        >
          Log Out
        </button>
      </div>
    );
  }

  export default Drawer;