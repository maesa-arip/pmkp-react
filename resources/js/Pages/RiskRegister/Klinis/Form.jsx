import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import ListBoxPage from "@/Components/ListBoxPage";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "@/Components/DatePicker/DatePicker";



export default function Form({
    errors,
    submit,
    data,
    setData,
    ShouldMap,
    model,
    closeButton,
}) {
    const defaultValue = [{ name: "Pilih" }];
    // console.log(ShouldMap);
    const [selectedProses, setSelectedProses] = useState(() => {
        if (model) {
            return ShouldMap.proses.find(x => x.id === model.proses_id);
        }
        return defaultValue[0];
    });
    const [selectedCategory, setSelectedCategory] = useState(() => {
        if (model) {
            return ShouldMap.riskCategories.find(x => x.id === model.risk_category_id);
        }
        return defaultValue[0];
    });
    // console.log(data)
    const [selectedSource, setSelectedSource] = useState(() => {
        if (model) {
            return ShouldMap.identificationSources.find(x => x.id === model.identification_source_id);
        }
        return defaultValue[0];
    });
    const [selectedLocation, setSelectedLocation] = useState(() => {
        if (model) {
            return ShouldMap.locations.find(x => x.id === model.location_id);
        }
        return defaultValue[0];
    });
    const [selectedVariety, setSelectedVariety] = useState(() => {
        if (model) {
            return ShouldMap.riskVarieties.find(x => x.id === model.risk_variety_id);
        }
        return defaultValue[0];
    });
    const [selectedType, setSelectedType] = useState(() => {
        if (model) {
            return ShouldMap.riskTypes.find(x => x.id === model.risk_type_id);
        }
        return defaultValue[0];
    });
    const [selectedImpact1, setSelectedImpact1] = useState(() => {
        if (model) {
            return ShouldMap.impactValues.find(x => x.id === model.osd1_dampak);
        }
        return defaultValue[0];
    });
    const [selectedProbability1, setSelectedProbability1] = useState(() => {
        if (model) {
            return ShouldMap.probabilityValues.find(x => x.id === model.osd1_probabilitas);
        }
        return defaultValue[0];
    });
    const [selectedControl1, setSelectedControl1] = useState(() => {
        if (model) {
            return ShouldMap.controlValues.find(x => x.id === model.osd1_controllability);
        }
        return defaultValue[0];
    });
    const [selectedImpact2, setSelectedImpact2] = useState(() => {
        if (model) {
            return ShouldMap.impactValues.find(x => x.id === model.osd2_dampak);
        }
        return defaultValue[0];
    });
    const [selectedProbability2, setSelectedProbability2] = useState(() => {
        if (model) {
            return ShouldMap.probabilityValues.find(x => x.id === model.osd2_probabilitas);
        }
        return defaultValue[0];
    });
    const [selectedControl2, setSelectedControl2] = useState(() => {
        if (model) {
            return ShouldMap.controlValues.find(x => x.id === model.osd2_controllability);
        }
        return defaultValue[0];
    });
    const [selectedPic, setSelectedPic] = useState(() => {
        if (model) {
            return ShouldMap.pics.find(x => x.id === model.pic_id);
        }
        return defaultValue[0];
    });
    const [selectedPengawasan, setSelectedPengawasan] = useState(() => {
        if (model) {
            return ShouldMap.pengawasan.find(x => x.id === model.pengawasan_id);
        }
        return defaultValue[0];
    });
    
    const [tglRegister, setTglRegister] = useState((null));
    const [tglSelesai, setTglSelesai] = useState((null));
    return (
        <>
            <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4">
                        <InputLabel for="Proses" value="Proses" />
                        <ListBoxPage
                            ShouldMap={ShouldMap.proses}
                            selected={selectedProses}
                            onChange={(e) => {
                                setData({ ...data, ["proses_id"]: e.id });
                                setSelectedProses(e);
                                
                            }}
                        />
                        <InputError
                            message={errors.proses_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-4">
                        <InputLabel
                            for="TanggalRegister"
                            value="Tanggal Register"
                        />
                        <DatePicker 
                        dateFormat="dd-MM-yyyy"
                        value={data.tgl_register}
                        selected={tglRegister} id="tgl_register" name="tgl_register" autoComplete="off" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                        onChange={(date) => {
                            setTglRegister(date);
                            const d = new Date(date).toLocaleDateString('en-CA');
                            // console.log(d);
                            setData("tgl_register", d);
                        }}
                         />
                        <InputError
                            message={errors.tgl_register}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-4">
                        <InputLabel
                            for="TanggalSelesai"
                            value="Tanggal Selesai"
                        />
                        {/* <DatePicker/> */}
                        <DatePicker 
                        dateFormat="dd-MM-yyyy"
                        value={data.tgl_selesai}
                        selected={tglSelesai} id="tgl_selesai" autoComplete="off" name="tgl_selesai" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                        onChange={(date) => {
                            setTglSelesai(date);
                            const d = new Date(date).toLocaleDateString('en-CA');
                            // console.log(d);
                            
                            setData("tgl_selesai", d);
                        }} />
                        
                        <InputError
                            message={errors.tgl_selesai}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-4">
                        <InputLabel
                            for="Kategori Risiko"
                            value="Kategori Risiko"
                        />
                        <ListBoxPage
                        ShouldMap={ShouldMap.riskCategories}
                            selected={selectedCategory}
                            onChange={(e) => {
                                setData({ ...data, ["risk_category_id"]: e.id });
                                setSelectedCategory(e);
                            }}
                        />
                        <InputError
                            message={errors.risk_category_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-4">
                        <InputLabel
                            for="Sumber Identifikasi"
                            value="Sumber Identifikasi"
                        />
                        <ListBoxPage
                            ShouldMap={ShouldMap.identificationSources}
                            selected={selectedSource}
                            onChange={(e) => {
                                setData({ ...data, ["identification_source_id"]: e.id });
                                setSelectedSource(e);
                            }}
                        />
                        <InputError
                            message={errors.identification_source_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-4">
                        <InputLabel for="Lokasi" value="Lokasi" />
                        <ListBoxPage
                            ShouldMap={ShouldMap.locations}
                            selected={selectedLocation}
                            onChange={(e) => {
                                setData({ ...data, ["location_id"]: e.id });
                                setSelectedLocation(e);
                            }}
                        />
                        <InputError
                            message={errors.location_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12">
                        <InputLabel
                            for="pernyataan risiko"
                            value="Pernyataan Risiko"
                        />
                        <TextAreaInput
                            id="pernyataan_risiko"
                            value={data.pernyataan_risiko}
                            handleChange={(e) =>
                                setData("pernyataan_risiko", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.pernyataan_risiko}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12">
                        <InputLabel
                            for="sebab"
                            value="Sebab Insiden / Kejadian"
                        />
                        <TextAreaInput
                            id="sebab"
                            value={data.sebab}
                            handleChange={(e) =>
                                setData("sebab", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.sebab}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="Jenis Insiden"
                            value="Jenis Insiden"
                        />
                        <ListBoxPage
                            ShouldMap={ShouldMap.riskVarieties}
                            selected={selectedVariety}
                            onChange={(e) => {
                                setData({ ...data, ["risk_variety_id"]: e.id });
                                setSelectedVariety(e);
                            }}
                        />
                        <InputError
                            message={errors.risk_variety_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="Tipe insiden"
                            value="Tipe Insiden"
                        />
                        <ListBoxPage
                            ShouldMap={ShouldMap.riskTypes}
                            selected={selectedType}
                            onChange={(e) => {
                                setData({ ...data, ["risk_type_id"]: e.id });
                                setSelectedType(e);
                            }}
                        />
                        <InputError
                            message={errors.risk_type_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-12">
                        <InputLabel for="efek" value="Efek / Dampak" />
                        <TextAreaInput
                            id="efek"
                            value={data.efek}
                            handleChange={(e) =>
                                setData("efek", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.efek}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6 p-2 my-2 border rounded-lg">
                        <label htmlFor="" className="block mb-4 text-lg font-bold text-gray-700">OSD 1</label>

                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Dampak"
                                value="Dampak"
                            />
                            <ListBoxPage
                                ShouldMap={ShouldMap.impactValues}
                                selected={selectedImpact1}
                                onChange={(e) => {
                                    setData({ ...data, ["osd1_dampak"]: e.id });
                                    setSelectedImpact1(e);
                                }}
                            />
                            <InputError
                                message={errors.osd1_dampak}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Probabilitas"
                            />
                            <ListBoxPage
                                ShouldMap={ShouldMap.probabilityValues}
                                selected={selectedProbability1}
                                onChange={(e) => {
                                    setData({ ...data, ["osd1_probabilitas"]: e.id });
                                    setSelectedProbability1(e);
                                }}
                            />
                            <InputError
                                message={errors.osd1_probabilitas}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Controllability"
                            />
                            <ListBoxPage
                                ShouldMap={ShouldMap.controlValues}
                                selected={selectedControl1}
                                onChange={(e) => {
                                    setData({ ...data, ["osd1_controllability"]: e.id });
                                    setSelectedControl1(e);
                                }}
                            />
                            <InputError
                                message={errors.osd1_controllability}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="col-span-6 p-2 my-2 border rounded-lg">
                        <label htmlFor="" className="block mb-4 text-lg font-bold text-gray-700">OSD 2</label>

                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Dampak"
                                value="Dampak"
                            />
                            <ListBoxPage
                                ShouldMap={ShouldMap.impactValues}
                                selected={selectedImpact2}
                                onChange={(e) => {
                                    setData({ ...data, ["osd2_dampak"]: e.id });
                                    setSelectedImpact2(e);
                                }}
                            />
                            <InputError
                                message={errors.osd2_dampak}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Probabilitas"
                            />
                            <ListBoxPage
                                ShouldMap={ShouldMap.probabilityValues}
                                selected={selectedProbability2}
                                onChange={(e) => {
                                    setData({ ...data, ["osd2_probabilitas"]: e.id });
                                    setSelectedProbability2(e);
                                }}
                            />
                            <InputError
                                message={errors.osd2_probabilitas}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-12 my-6">
                            <InputLabel
                                for="Kategori Risiko"
                                value="Controllability"
                            />
                            <ListBoxPage
                                ShouldMap={ShouldMap.controlValues}
                                selected={selectedControl2}
                                onChange={(e) => {
                                    setData({ ...data, ["osd2_controllability"]: e.id });
                                    setSelectedControl2(e);
                                }}
                            />
                            <InputError
                                message={errors.osd2_controllability}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="col-span-12 p-2 border rounded-lg">
                        <label htmlFor="" className="block mb-4 text-lg font-bold text-gray-700">Grading Matrix</label>
                        <div className="col-span-12">
                        <TextInput
                            id="grading"
                            value={data.grading}
                            handleChange={(e) =>
                                setData("grading", e.target.value)
                            }
                            readOnly={false}
                            type="number"
                            className="block w-full mt-1"
                        />
                        <InputError message={errors.grading} className="mt-2" />
                    </div>
                    </div>

                    <div className="col-span-12">
                        <InputLabel
                            for="pengendalian_risiko"
                            value="Pengendalian Risiko"
                        />
                        <TextAreaInput
                            id="pengendalian_risiko"
                            value={data.pengendalian_risiko}
                            handleChange={(e) =>
                                setData("pengendalian_risiko", e.target.value)
                            }
                            // onChange={onChange}
                            type="text"
                            className="block w-full mt-1"
                        />
                        <InputError
                            message={errors.pengendalian_risiko}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="Kategori Risiko"
                            value="Penanggung Jawab / Pic"
                        />
                        <ListBoxPage
                            ShouldMap={ShouldMap.pics}
                            selected={selectedPic}
                            onChange={(e) => {
                                setData({ ...data, ["pic_id"]: e.id });
                                setSelectedPic(e);
                            }}
                        />
                        <InputError
                            message={errors.pic_id}
                            className="mt-2"
                        />
                    </div>
                    <div className="col-span-6">
                        <InputLabel
                            for="Sumber Identifikasi"
                            value="Pengawasan"
                        />
                        <ListBoxPage
                            ShouldMap={ShouldMap.pengawasan}
                            selected={selectedPengawasan}
                            onChange={(e) => {
                                setData({ ...data, ["pengawasan_id"]: e.id });
                                setSelectedPengawasan(e);
                            }}
                        />
                        <InputError
                            message={errors.pengawasan_id}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <PrimaryButton>{submit}</PrimaryButton>
                <SecondaryButton className="mx-2" onClick={closeButton}>
                    Batal
                </SecondaryButton>
            </div>
        </>
    );
}
