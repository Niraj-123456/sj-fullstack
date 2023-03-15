

import { nepalProvinces, nepalDistricts } from "../constants/address-consts"

const getProvinceWithDistricts = () => {
    console.log("Province")
    // console.log(nepalProvinces)

    let provinceList = []
    
    let provinceDistrictList = []
    let provinceDistrictObj = {}
    provinceDistrictObj['Province Name'] = ''
    provinceDistrictObj['Province Number'] = ''
    provinceDistrictObj['Districts'] = []

    for (let i = 0; i < nepalProvinces.length; i++) {
        provinceList.push(nepalProvinces[i]['Province Name'])

        provinceDistrictObj = {}
        provinceDistrictObj['Province Name'] = nepalProvinces[i]['Province Name']
        provinceDistrictObj['Province Number'] = nepalProvinces[i]['Province Number']
        provinceDistrictObj['Districts'] = []

        provinceDistrictList.push(provinceDistrictObj)
    }

    // console.log(provinceDistrictList)




    // let districtList = []
    let currentDistrictName = ''
    let currentDistrictProvince = ''
    let indexOfProvince

    

    for (let i = 0; i < nepalDistricts.length; i++) {

        currentDistrictName = nepalDistricts[i]['Name']
        currentDistrictProvince = nepalDistricts[i]["Province"]

        indexOfProvince = provinceDistrictList.findIndex(province => province['Province Name'] === nepalDistricts[i]["Province"])

        provinceDistrictList[indexOfProvince]['Districts'].push(currentDistrictName)


        // if currentDistrictProvince
        // districtList.push(nepalDistricts[i]['Name'])
    }


    console.log(provinceDistrictList)
    // console.log( nepalDistricts.length)

    // console.log("Disticts")
    // console.log(nepalDistricts)

}

getProvinceWithDistricts()