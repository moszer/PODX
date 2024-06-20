import Navigation from "./Navigation";
import ThemeSelector from "./Themeselector";

export default function Setting(){
    return (
        <div className="h-[100vh] bg-base-200">  
            <div className="p-4">
                <div className="text-4xl">
                    <h1>Settings</h1>
                </div>
                <div className="pt-4">
                    <div className="pb-4 text-1xl">
                        <h1>THEME</h1>
                    </div>
                    <div className="border-2 border-primary">
                        <ThemeSelector />
                    </div>
                </div>
            </div>
            <Navigation/>
        </div>
    );
}