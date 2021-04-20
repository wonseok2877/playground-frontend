const SettingButton = ({ setIsModalOpen }) => {
  return (
    <button
      onClick={() => setIsModalOpen(true)}
      className="p-3 rounded-full focus:outline-none"
    >
      <i className="fas fa-cog text-4xl text-gray-500"></i>
    </button>
  );
};

export default SettingButton;
