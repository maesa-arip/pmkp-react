import{K as d,r as c,a as t}from"./app-4dc7e864.js";import h from"./Form-0ff13e29.js";import"./ComboboxPage-ebb481cb.js";import"./use-tracked-pointer-ac86867a.js";import"./render-ea42b304.js";import"./keyboard-84303bfc.js";import"./use-outside-click-a2e1bd03.js";import"./use-tree-walker-f4949a02.js";import"./use-controllable-d514a8f4.js";import"./transition-53d35c05.js";import"./use-watch-579ebb77.js";import"./InputError-e6c099ae.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./TextAreaInput-36efdc5d.js";import"./TextInput-6a3dc504.js";import"./ComboboxMultiple-52cd8efc.js";import"./clsx-8d99dcf0.js";import"./defineProperty-8250cd14.js";function A({setIsOpenEditDialog:n,model:i,ShouldMap:r}){const{data:a,setData:_,put:s,reset:k,errors:u}=d({namapasien:i.namapasien,nrm:i.nrm,umur_tahun:i.umur_tahun,umur_bulan:i.umur_bulan,umur_hari:i.umur_hari,ikp_penanggung_id:i.ikp_penanggung_id,jeniskelamin:i.jeniskelamin,tanggal_pelayanan:i.tanggal_pelayanan,tanggal_insiden:i.tanggal_insiden,insiden:i.insiden,kronologi:i.kronologi,ikp_jenis_insiden_id:i.ikp_jenis_insiden_id,ikp_tipe_insiden_id:i.ikp_tipe_insiden_id,ikp_spesialisasi_id:i.ikp_spesialisasi_id,ikp_dampak_id:i.ikp_dampak_id,ikp_probabilitas_id:i.ikp_probabilitas_id,concatdp:i.concatdp,ikp_pelapor_id:i.ikp_pelapor_id,ikp_gruplayanan_id:i.ikp_gruplayanan_id,ikp_lokasi_id:i.ikp_lokasi_id,lokasi_name:i.lokasi_name,pic_id:i.pic_id,tindak_lanjut_hasil:i.tindak_lanjut_hasil,ikp_penindak_id:i.ikp_penindak_id,terjadi_tempatlain:i.terjadi_tempatlain,langkah_tempatlain:i.langkah_tempatlain,user_id:i.user_id}),e=p=>n(!1),g=p=>{p.preventDefault(),s(route("IkpPasien.update",i.id),{data:a,onSuccess:()=>{k(),n(!1)}})};return c.useEffect(()=>{_({...a,namapasien:i.namapasien,nrm:i.nrm,umur_tahun:i.umur_tahun,umur_bulan:i.umur_bulan,umur_hari:i.umur_hari,ikp_penanggung_id:i.ikp_penanggung_id,jeniskelamin:i.jeniskelamin,tanggal_pelayanan:i.tanggal_pelayanan,tanggal_insiden:i.tanggal_insiden,insiden:i.insiden,kronologi:i.kronologi,ikp_jenis_insiden_id:i.ikp_jenis_insiden_id,ikp_tipe_insiden_id:i.ikp_tipe_insiden_id,ikp_spesialisasi_id:i.ikp_spesialisasi_id,ikp_dampak_id:i.ikp_dampak_id,ikp_probabilitas_id:i.ikp_probabilitas_id,concatdp:i.concatdp,ikp_pelapor_id:i.ikp_pelapor_id,ikp_gruplayanan_id:i.ikp_gruplayanan_id,ikp_lokasi_id:i.ikp_lokasi_id,lokasi_name:i.lokasi_name,pic_id:i.pic_id,tindak_lanjut_hasil:i.tindak_lanjut_hasil,ikp_penindak_id:i.ikp_penindak_id,terjadi_tempatlain:i.terjadi_tempatlain,langkah_tempatlain:i.langkah_tempatlain,user_id:i.user_id})},[i]),t("form",{onSubmit:g,children:t(h,{errors:u,data:a,setData:_,model:i,ShouldMap:r,submit:"Update",closeButton:e})})}export{A as default};
