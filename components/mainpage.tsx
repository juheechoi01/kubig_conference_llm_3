import Image from "next/image";
import React from "react";

const MainPage = () => {
    return (
        <div className="flex flex-col h-full mx-4 pt-[110] flex-1 align-middle items-center ">
            <Image
                src="/images/nararag-logo.png"
                alt="NaraRAG"
                width={450}
                height={100}
                className="animate-image-up"
            />
            <div className="pt-[20] flex flex-col align-middle items-center">
                <div className="pt-5">Welcome to NaraRAG!</div>

                <div className="pt-[20px]">
                    <button className="bg-blue-400 px-2 py-1 hover:bg-blue-300 transition-colors ease-in-out text-white rounded-md ">
                        Start Chatting!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
