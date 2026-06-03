package com.zhuly.config;

import com.zhuly.domain.Facility;
import com.zhuly.domain.FacilityType;
import com.zhuly.domain.ScenicSpot;
import com.zhuly.domain.UserProfile;
import com.zhuly.repository.FacilityRepository;
import com.zhuly.repository.ScenicSpotRepository;
import com.zhuly.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ScenicSpotRepository spotRepository;
    private final FacilityRepository facilityRepository;
    private final UserProfileRepository userRepository;

    @Override
    public void run(String... args) {
        ensureDemoUser();
        if (spotRepository.count() > 0) {
            return;
        }

        ScenicSpot forestPark = spot(
                "蜀南竹海", "自然风光", "宜宾市长宁县竹海镇",
                "28.4712", "104.9851", "08:30-17:30", "0831-4980000", "100",
                4.8, 5000,
                "蜀南竹海位于宜宾长宁、江安一带，以连片竹林、湖泊、瀑布、古寺和山地峡谷景观著称。景区面积广、森林覆盖率高，适合避暑、徒步、摄影和亲水游览。",
                "建议上午从观云亭进入，下午游览翡翠长廊；夏季避暑体验最佳。",
                "东汉以来，当地居民已广泛利用竹资源，形成了具有地方特色的生活方式。20世纪80年代，景区旅游开发逐步启动；1988年被批准为国家级风景名胜区，之后陆续完善道路、游客中心、观光交通和度假配套，逐渐从自然观光景区发展为综合型休闲度假目的地。",
                "翡翠长廊、七彩飞瀑、忘忧谷、仙女湖、观海楼都是高频打卡点；夏季气温较城区更舒适，雨后瀑布水量更丰。",
                "春夏", "雨天栈道湿滑，请穿防滑鞋。",
                Arrays.asList(
                        "https://upload.wikimedia.org/wikipedia/commons/c/cf/Qicai_Waterfall_%2833000790668%29.jpg",
                        "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                ));

        ScenicSpot oldTown = spot(
                "李庄古镇", "历史人文", "宜宾市翠屏区李庄镇",
                "28.8054", "104.6616", "全天开放", "0831-7897357", "0",
                4.6, 3000,
                "李庄古镇位于长江南岸，是川南重要历史文化名镇。古镇格局、会馆建筑、宗祠庙宇和抗战文化旧址保存较好，适合慢行游览、研学参观和地方美食体验。",
                "优先游览旋螺殿、张家祠，再品尝李庄白肉。",
                "李庄早在南梁大同六年，即公元540年，便成为南广县治和六同郡治所在地。明代设镇后，依托长江码头和移民往来发展为川南商贸重镇。抗战时期，同济大学、中央研究院、中央博物院、中国营造学社等机构迁入李庄，古镇由此成为重要文化中心之一。近年来，李庄围绕古建保护、抗战文化展示和博物馆建设持续更新，形成历史街区、陈列馆、研学线路结合的文旅格局。",
                "旋螺殿、中国营造学社旧址、张家祠、禹王宫和李庄白肉是最有代表性的体验；夜间古街灯光更适合拍照。",
                "四季", "节假日餐饮排队较久。",
                Arrays.asList(
                        "https://upload.wikimedia.org/wikipedia/commons/4/4f/Lizhuang_Township.JPG",
                        "https://upload.wikimedia.org/wikipedia/commons/0/06/Yuwanggong.JPG",
                        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
                ));

        ScenicSpot riverPark = spot(
                "三江口滨江公园", "城市休闲", "宜宾市叙州区三江口",
                "28.7701", "104.6422", "全天开放", "0831-8222215", "0",
                4.5, 8000,
                "三江口一带处在金沙江、岷江汇流形成长江的城市核心地带，滨江公园串联江岸步道、观景平台、夜景灯光和城市公共空间，是本地居民散步、骑行和游客打卡长江起点的重要区域。",
                "傍晚抵达可同时看到落日与夜景灯光。",
                "宜宾老城自古依江而建，合江门一带因两江汇合而得名，是城市水运、商贸和城防记忆的重要节点。现代滨江公园是在城市更新和滨水空间开放过程中逐渐形成的公共休闲带，将江岸景观、慢行步道、夜游观光和城市客厅功能结合起来，使三江口从交通与商贸节点转变为市民共享的城市景观窗口。",
                "推荐傍晚到达，先看江面落日，再沿滨江步道欣赏合江门、夹镜楼和城市灯光；适合亲子散步、夜景摄影和短暂停留。",
                "秋季", "江边风大，注意保暖。",
                Arrays.asList(
                        "https://upload.wikimedia.org/wikipedia/commons/f/f9/%E5%AE%9C%E5%AE%BE%E5%B8%82%E5%90%88%E6%B1%9F%E9%97%A8.jpg",
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                ));

        spotRepository.saveAll(Arrays.asList(forestPark, oldTown, riverPark));
        spotRepository.saveAll(nationalHotSpots());
        spotRepository.saveAll(extraNationalSpots());

        facilityRepository.saveAll(Arrays.asList(
                facility(FacilityType.PARKING, "竹海游客中心停车场", "28.4699", "104.9820", "15", 126, null, null, null, 4.4),
                facility(FacilityType.TOILET, "翡翠长廊公共厕所", "28.4761", "104.9880", "0", null, 4.6, null, null, 4.6),
                facility(FacilityType.RESTAURANT, "竹笋人家", "28.4728", "104.9866", null, null, null, "川菜", "68", 4.7),
                facility(FacilityType.RESTAURANT, "李庄白肉老店", "28.8070", "104.6630", null, null, null, "川南小吃", "52", 4.5)
        ));

    }

    private void ensureDemoUser() {
        UserProfile demo = userRepository.findByUsername("demo").orElseGet(UserProfile::new);
        demo.setUsername("demo");
        if (demo.getEmail() == null || demo.getEmail().trim().isEmpty()) {
            demo.setEmail("demo@example.com");
        }
        demo.setPassword("demo123");
        if (demo.getPoints() == 0) {
            demo.setPoints(120);
        }
        userRepository.save(demo);
    }

    private ScenicSpot spot(String name, String type, String address, String lat, String lng, String hours,
                            String phone, String price, double rating, int capacity, String description,
                            String guide, String history, String highlights, String season, String notice,
                            List<String> gallery) {
        ScenicSpot spot = new ScenicSpot();
        spot.setName(name);
        spot.setType(type);
        spot.setAddress(address);
        spot.setLatitude(new BigDecimal(lat));
        spot.setLongitude(new BigDecimal(lng));
        spot.setOpenHours(hours);
        spot.setPhone(phone);
        spot.setPrice(new BigDecimal(price));
        spot.setRating(rating);
        spot.setMaxCapacity(capacity);
        spot.setDescription(description != null && !description.contains(name) ? name + "：" + description : description);
        spot.setGuide(guide);
        spot.setHistory(history);
        spot.setHighlights(highlights);
        spot.setBestSeason(season);
        spot.setNotice(notice);
        List<String> resolvedGallery = new ArrayList<>();
        if (gallery != null) {
            for (String image : gallery) {
                if (image != null && !image.trim().isEmpty() && !resolvedGallery.contains(image)) {
                    resolvedGallery.add(image);
                }
            }
        }
        if (resolvedGallery.isEmpty()) {
            resolvedGallery.add(spotImage(name, "景区图片"));
        }
        while (resolvedGallery.size() < 3) {
            resolvedGallery.add(spotImage(name, resolvedGallery.size() == 1 ? "风景照片" : "游客实拍"));
        }
        spot.setCoverImage(resolvedGallery.get(0));
        spot.setGallery(resolvedGallery);
        return spot;
    }

    private String spotImage(String name, String scene) {
        String query = UriUtils.encodeQueryParam(name + " " + scene, StandardCharsets.UTF_8);
        return "https://tse1.mm.bing.net/th?q=" + query + "&w=1200&h=675&c=7&rs=1&p=0&o=5&pid=1.7";
    }

    private List<ScenicSpot> extraNationalSpots() {
        List<ScenicSpot> spots = new ArrayList<>();
        addQuick(spots, "颐和园", "历史人文", "北京市海淀区新建宫门路19号", "39.9999", "116.2755", 4.8, "皇家园林、昆明湖与万寿山");
        addQuick(spots, "天坛公园", "历史人文", "北京市东城区天坛东里甲1号", "39.8822", "116.4066", 4.8, "祭天建筑群与圜丘祈年殿");
        addQuick(spots, "圆明园遗址公园", "历史人文", "北京市海淀区清华西路28号", "40.0086", "116.3005", 4.6, "皇家园林遗址与西洋楼遗迹");
        addQuick(spots, "什刹海", "城市休闲", "北京市西城区地安门西大街", "39.9402", "116.3842", 4.5, "胡同、水岸与老北京生活");
        addQuick(spots, "天津之眼", "城市休闲", "天津市红桥区三岔河口永乐桥", "39.1532", "117.1857", 4.5, "海河夜景与摩天轮观景");
        addQuick(spots, "承德避暑山庄", "历史人文", "河北省承德市双桥区丽正门大街22号", "40.9925", "117.9355", 4.8, "皇家园林、山水格局与外八庙");
        addQuick(spots, "北戴河鸽子窝公园", "自然风光", "河北省秦皇岛市北戴河区鸽赤路25号", "39.8390", "119.5210", 4.5, "滨海日出、湿地与候鸟观赏");
        addQuick(spots, "乔家大院", "历史人文", "山西省晋中市祁县东观镇乔家堡村", "37.4073", "112.4672", 4.5, "晋商宅院、砖雕木雕与家族文化");
        addQuick(spots, "悬空寺", "历史人文", "山西省大同市浑源县恒山脚下", "39.6565", "113.7040", 4.7, "悬崖古寺与木构建筑奇观");
        addQuick(spots, "五台山", "历史人文", "山西省忻州市五台县台怀镇", "39.0090", "113.5960", 4.7, "佛教名山、寺院群与清凉山地");
        addQuick(spots, "呼伦贝尔大草原", "自然风光", "内蒙古自治区呼伦贝尔市陈巴尔虎旗", "49.3200", "119.9000", 4.8, "草原、河流、牧场与边疆风光");
        addQuick(spots, "成吉思汗陵", "历史人文", "内蒙古自治区鄂尔多斯市伊金霍洛旗", "39.3610", "109.7880", 4.5, "蒙古族历史文化与祭祀建筑");
        addQuick(spots, "大连老虎滩海洋公园", "城市休闲", "辽宁省大连市中山区滨海中路9号", "38.8810", "121.6730", 4.5, "海洋馆、滨海风光与亲子游乐");
        addQuick(spots, "长白山天池", "自然风光", "吉林省延边朝鲜族自治州安图县", "42.0060", "128.0550", 4.8, "火山湖、雪峰与高山森林");
        addQuick(spots, "伪满皇宫博物院", "历史人文", "吉林省长春市宽城区光复北路5号", "43.9098", "125.3525", 4.6, "近代历史建筑与专题展陈");
        addQuick(spots, "镜泊湖风景区", "自然风光", "黑龙江省牡丹江市宁安市", "44.0500", "129.0300", 4.6, "火山堰塞湖、瀑布与森林景观");
        addQuick(spots, "莫高窟", "历史人文", "甘肃省敦煌市东南25公里", "40.0370", "94.8090", 4.9, "佛教石窟、壁画和彩塑艺术");
        addQuick(spots, "鸣沙山月牙泉", "自然风光", "甘肃省敦煌市鸣山路", "40.0930", "94.6710", 4.8, "沙山、月牙泉与大漠落日");
        addQuick(spots, "嘉峪关关城", "历史人文", "甘肃省嘉峪关市峪泉镇", "39.8020", "98.2160", 4.6, "明长城关隘与丝路边塞文化");
        addQuick(spots, "张掖七彩丹霞", "自然风光", "甘肃省张掖市临泽县倪家营镇", "38.9720", "100.0700", 4.7, "彩色丘陵、丹霞地貌与日落光影");
        addQuick(spots, "麦积山石窟", "历史人文", "甘肃省天水市麦积区麦积镇", "34.3530", "106.0090", 4.7, "崖壁石窟、泥塑造像与栈道");
        addQuick(spots, "崆峒山", "自然风光", "甘肃省平凉市崆峒区", "35.5450", "106.5410", 4.5, "道教名山、峡谷与山地景观");
        addQuick(spots, "喀纳斯景区", "自然风光", "新疆维吾尔自治区阿勒泰地区布尔津县", "48.7040", "87.0340", 4.8, "高山湖泊、森林、图瓦村落与秋色");
        addQuick(spots, "赛里木湖", "自然风光", "新疆维吾尔自治区博尔塔拉蒙古自治州博乐市", "44.6100", "81.1660", 4.8, "高原湖泊、草原花海与雪山倒影");
        addQuick(spots, "那拉提草原", "自然风光", "新疆维吾尔自治区伊犁州新源县", "43.2800", "84.0500", 4.7, "空中草原、牧场与天山风光");
        addQuick(spots, "吐鲁番火焰山", "自然风光", "新疆维吾尔自治区吐鲁番市高昌区", "42.9500", "89.6200", 4.4, "红色山体、干热地貌与西游文化");
        addQuick(spots, "茶卡盐湖", "自然风光", "青海省海西蒙古族藏族自治州乌兰县茶卡镇", "36.7810", "99.0780", 4.5, "盐湖倒影、天空之镜与高原风光");
        addQuick(spots, "塔尔寺", "历史人文", "青海省西宁市湟中区金塔路56号", "36.4890", "101.5700", 4.6, "藏传佛教寺院、壁画和酥油花");
        addQuick(spots, "沙湖旅游区", "自然风光", "宁夏回族自治区石嘴山市平罗县", "38.8170", "106.3700", 4.5, "湖泊、芦苇、沙漠与候鸟");
        addQuick(spots, "镇北堡西部影城", "城市休闲", "宁夏回族自治区银川市西夏区镇北堡镇", "38.6120", "106.0710", 4.6, "影视场景、黄土城堡与西北风情");
        addQuick(spots, "壶口瀑布", "自然风光", "陕西省延安市宜川县壶口镇", "36.1460", "110.4460", 4.7, "黄河峡谷、瀑布奔流与高原气势");
        addQuick(spots, "大雁塔", "历史人文", "陕西省西安市雁塔区雁塔路", "34.2190", "108.9590", 4.6, "唐代佛塔、广场夜景与历史街区");
        addQuick(spots, "西安城墙", "历史人文", "陕西省西安市碑林区南大街", "34.2580", "108.9450", 4.7, "古城墙、骑行和城门景观");
        addQuick(spots, "法门寺", "历史人文", "陕西省宝鸡市扶风县法门镇", "34.4380", "107.8980", 4.6, "佛教文化、地宫遗址与舍利展陈");
        addQuick(spots, "龙门石窟", "历史人文", "河南省洛阳市洛龙区龙门中街13号", "34.5590", "112.4720", 4.8, "石窟造像、伊河两岸与卢舍那大佛");
        addQuick(spots, "少林寺", "历史人文", "河南省郑州市登封市嵩山少林风景区", "34.5060", "112.9350", 4.6, "禅宗祖庭、武术文化与嵩山景观");
        addQuick(spots, "云台山风景区", "自然风光", "河南省焦作市修武县岸上乡", "35.4210", "113.3860", 4.6, "峡谷、瀑布、红石峡与太行山水");
        addQuick(spots, "清明上河园", "城市休闲", "河南省开封市龙亭区龙亭西路5号", "34.8070", "114.3480", 4.5, "宋文化主题园、演艺和夜游");
        addQuick(spots, "武当山", "历史人文", "湖北省十堰市丹江口市武当山特区", "32.5400", "111.0000", 4.7, "道教宫观、山岳景观与武当文化");
        addQuick(spots, "黄鹤楼", "历史人文", "湖北省武汉市武昌区蛇山西山坡特1号", "30.5460", "114.2970", 4.6, "名楼、长江视野与诗词文化");
        addQuick(spots, "三峡大坝旅游区", "历史人文", "湖北省宜昌市夷陵区三斗坪镇", "30.8230", "111.0030", 4.6, "水利工程、长江峡谷与工程展陈");
        addQuick(spots, "神农架林区", "自然风光", "湖北省神农架林区", "31.7440", "110.6750", 4.7, "原始森林、高山草甸与生态观光");
        addQuick(spots, "岳阳楼", "历史人文", "湖南省岳阳市岳阳楼区洞庭北路", "29.3730", "113.0890", 4.6, "江南名楼、洞庭湖与范仲淹名篇");
        addQuick(spots, "凤凰古城", "历史人文", "湖南省湘西土家族苗族自治州凤凰县", "27.9480", "109.5990", 4.5, "沱江吊脚楼、古城街巷与苗疆风情");
        addQuick(spots, "橘子洲", "城市休闲", "湖南省长沙市岳麓区橘子洲头", "28.1900", "112.9580", 4.6, "湘江洲岛、城市公园与青年雕像");
        addQuick(spots, "南岳衡山", "自然风光", "湖南省衡阳市南岳区", "27.2540", "112.7340", 4.7, "五岳名山、寺庙群与山地日出");
        addQuick(spots, "韶山毛泽东故居", "历史人文", "湖南省湘潭市韶山市韶山乡", "27.9150", "112.4940", 4.5, "红色旅游、故居展陈与乡村景观");
        addQuick(spots, "丹霞山", "自然风光", "广东省韶关市仁化县", "25.0350", "113.7480", 4.6, "丹霞地貌、赤壁峰林与锦江风光");
        addQuick(spots, "开平碉楼文化旅游区", "历史人文", "广东省江门市开平市塘口镇", "22.2880", "112.5650", 4.6, "侨乡碉楼、村落建筑与中西合璧风格");
        addQuick(spots, "广州白云山", "自然风光", "广东省广州市白云区广园中路", "23.1850", "113.2980", 4.5, "城市山地、公园步道与羊城远眺");
        addQuick(spots, "珠海长隆海洋王国", "城市休闲", "广东省珠海市横琴新区富祥湾", "22.0980", "113.5440", 4.7, "海洋主题乐园、动物展示与大型演艺");
        addQuick(spots, "阳朔西街", "城市休闲", "广西壮族自治区桂林市阳朔县西街", "24.7780", "110.4940", 4.5, "喀斯特山水、老街夜游与休闲餐饮");
        addQuick(spots, "德天跨国瀑布", "自然风光", "广西壮族自治区崇左市大新县硕龙镇", "22.8540", "106.7220", 4.7, "跨国瀑布、边境山水与喀斯特风光");
        addQuick(spots, "北海银滩", "自然风光", "广西壮族自治区北海市银海区", "21.4300", "109.1210", 4.5, "海滨沙滩、日落与滨海休闲");
        addQuick(spots, "恩施大峡谷", "自然风光", "湖北省恩施土家族苗族自治州恩施市", "30.4430", "109.2040", 4.7, "峡谷绝壁、地缝栈道与喀斯特地貌");
        addQuick(spots, "赤水丹霞旅游区", "自然风光", "贵州省遵义市赤水市", "28.4850", "105.9990", 4.6, "丹霞赤壁、瀑布群与竹海");
        addQuick(spots, "梵净山", "自然风光", "贵州省铜仁市江口县太平镇", "27.9030", "108.6900", 4.8, "蘑菇石、红云金顶与高山生态");
        addQuick(spots, "黄果树瀑布", "自然风光", "贵州省安顺市镇宁布依族苗族自治县", "25.9900", "105.6700", 4.7, "大型瀑布群、水帘洞与喀斯特河谷");
        addQuick(spots, "西江千户苗寨", "历史人文", "贵州省黔东南苗族侗族自治州雷山县", "26.4970", "108.1740", 4.6, "苗族聚落、吊脚楼与夜景灯火");
        addQuick(spots, "峨眉山", "自然风光", "四川省乐山市峨眉山市黄湾镇", "29.5200", "103.3330", 4.8, "佛教名山、金顶云海与森林步道");
        addQuick(spots, "乐山大佛", "历史人文", "四川省乐山市市中区凌云路", "29.5440", "103.7730", 4.7, "摩崖大佛、三江汇流与佛教石刻");
        addQuick(spots, "都江堰景区", "历史人文", "四川省成都市都江堰市公园路", "31.0010", "103.6060", 4.8, "古代水利工程、鱼嘴与青城山游线");
        addQuick(spots, "稻城亚丁", "自然风光", "四川省甘孜藏族自治州稻城县香格里拉镇", "28.4250", "100.3490", 4.7, "雪山、海子、草甸与高原徒步");
        addQuick(spots, "四姑娘山", "自然风光", "四川省阿坝藏族羌族自治州小金县", "31.1020", "102.9020", 4.7, "雪峰、沟谷、森林与户外徒步");
        addQuick(spots, "中国科学院西双版纳热带植物园", "自然风光", "云南省西双版纳傣族自治州勐腊县勐仑镇", "21.9250", "101.2550", 4.8, "热带植物、雨林生态与科普游览");
        addQuick(spots, "石林风景区", "自然风光", "云南省昆明市石林彝族自治县", "24.8170", "103.3230", 4.6, "喀斯特石林、彝族文化与地质景观");
        addQuick(spots, "腾冲热海", "自然风光", "云南省保山市腾冲市清水乡", "24.9510", "98.4640", 4.6, "地热温泉、火山地貌与热海景观");
        addQuick(spots, "普达措国家公园", "自然风光", "云南省迪庆藏族自治州香格里拉市", "27.8230", "99.9900", 4.6, "高原湖泊、草甸、森林与藏区生态");
        addQuick(spots, "纳木错", "自然风光", "西藏自治区拉萨市当雄县", "30.7160", "90.5500", 4.7, "高原圣湖、雪山倒影与湖岸星空");
        addQuick(spots, "珠穆朗玛峰大本营", "自然风光", "西藏自治区日喀则市定日县", "28.1420", "86.8520", 4.8, "世界最高峰远眺、高原风光与登山文化");
        addQuick(spots, "南山文化旅游区", "历史人文", "海南省三亚市崖州区南山村", "18.3020", "109.2080", 4.6, "海上观音、佛教文化与滨海园林");
        addQuick(spots, "鼓山风景区", "自然风光", "福建省福州市晋安区鼓山镇", "26.0710", "119.3860", 4.5, "城市山地、古寺和闽江远眺");
        return new ArrayList<>(spots.subList(0, Math.min(31, spots.size())));
    }

    private void addQuick(List<ScenicSpot> spots, String name, String type, String address,
                          String lat, String lng, double rating, String theme) {
        spots.add(spot(
                name, type, address, lat, lng, "全天或按景区公告开放", "景区服务热线", "0",
                rating, 40000,
                name + "位于" + address + "，以" + theme + "闻名，是全国热门旅游目的地之一。",
                "建议提前查询预约和开放信息，结合交通、天气与体力安排半日到一日游览。",
                name + "长期承载当地自然景观、历史记忆或城市休闲功能，是区域文旅线路中的代表节点。",
                theme + "是这里最有辨识度的体验，适合拍照、研学、亲子或慢游。",
                "四季", "节假日客流较大，建议错峰出行并留意景区公告。",
                Arrays.asList(spotImage(name, "景点图片"), spotImage(name, "风景照片"), spotImage(name, "旅游实拍"))
        ));
    }

    private List<ScenicSpot> nationalHotSpots() {
        return Arrays.asList(
                spot(
                        "故宫博物院", "历史人文", "北京市东城区景山前街4号",
                        "39.9163", "116.3972", "08:30-17:00", "010-85007421", "60",
                        4.9, 80000,
                        "故宫博物院位于北京中轴线核心，是明清两代皇家宫殿，也是中国古代宫廷建筑群的代表。",
                        "建议提前预约上午场，从午门进入，沿中轴线游览三大殿、乾清宫、御花园，再按兴趣选择珍宝馆或钟表馆。",
                        "故宫始建于明永乐年间，1925年成立博物院，现以古建筑、宫廷史和文物收藏共同构成世界级文化遗产展示空间。",
                        "太和殿、乾清宫、角楼、珍宝馆和雪后红墙是高频打卡点。",
                        "四季", "旺季客流大，请提前预约并预留安检时间。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "八达岭长城", "历史人文", "北京市延庆区G6京藏高速58号出口",
                        "40.3598", "116.0200", "07:30-17:30", "010-69122222", "40",
                        4.8, 65000,
                        "八达岭长城是明长城代表段落，城墙雄伟、设施完善，是初次游览长城的经典选择。",
                        "体力有限可选择缆车上下，徒步建议穿防滑鞋，上午到达可避开部分团队客流。",
                        "八达岭段因地势险要，自古为京畿屏障，现代旅游设施完善后成为长城文化展示窗口。",
                        "北八楼、好汉碑、长城博物馆和远眺群山的城墙弯道最受欢迎。",
                        "春秋", "风大温差明显，请注意防晒和保暖。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1510332981392-36692ea3a195?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "西湖风景名胜区", "自然风光", "浙江省杭州市西湖区龙井路1号",
                        "30.2420", "120.1500", "全天开放", "0571-87977767", "0",
                        4.9, 120000,
                        "西湖以湖山格局、园林景观和人文故事闻名，是杭州最具代表性的开放式景区。",
                        "可按断桥、白堤、苏堤、雷峰塔、花港观鱼串联半日游，骑行和步行都很适合。",
                        "西湖历经唐宋以来持续营建，湖堤、寺塔、园林和诗词传说共同形成独特文化景观。",
                        "断桥残雪、苏堤春晓、雷峰夕照、三潭印月和曲院风荷是核心看点。",
                        "春秋", "节假日湖滨人流密集，建议公共交通出行。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "黄山风景区", "自然风光", "安徽省黄山市黄山区汤口镇",
                        "30.1300", "118.1700", "06:30-17:30", "0559-5561111", "190",
                        4.9, 50000,
                        "黄山以奇松、怪石、云海、温泉和冬雪著称，是中国山岳景观的代表。",
                        "建议至少安排两天一晚，前山或后山上行都可，天气好时重点等待日出和云海。",
                        "黄山自古为名山胜境，明清以来游记、绘画和诗文不断强化其山水审美价值。",
                        "迎客松、光明顶、西海大峡谷、始信峰和莲花峰都是代表性景观。",
                        "春秋冬", "山上天气变化快，请携带雨具和保暖衣物。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "张家界国家森林公园", "自然风光", "湖南省张家界市武陵源区",
                        "29.3254", "110.4348", "07:30-18:00", "0744-5712189", "227",
                        4.8, 60000,
                        "张家界以石英砂岩峰林地貌闻名，峡谷、森林和云雾共同构成极具辨识度的山地景观。",
                        "推荐袁家界、天子山、金鞭溪组合游览，两天行程更从容。",
                        "景区以独特峰林地貌成为世界自然遗产核心区域，旅游线路逐步形成山上观景和谷底徒步结合的格局。",
                        "袁家界、百龙天梯、天子山、金鞭溪和十里画廊是热门点位。",
                        "春秋", "山路换乘多，请留意环保车末班时间。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "九寨沟风景名胜区", "自然风光", "四川省阿坝藏族羌族自治州九寨沟县漳扎镇",
                        "33.2600", "103.9180", "08:00-17:00", "0837-7739753", "190",
                        4.8, 41000,
                        "九寨沟以高山湖泊、彩林、瀑布和雪峰闻名，水色层次丰富，是川西代表性自然景区。",
                        "建议按树正沟、日则沟、则查洼沟分区游览，秋季彩林最受欢迎。",
                        "九寨沟以自然生态和藏羌文化共同构成旅游吸引力，保护和预约游览是景区管理重点。",
                        "五花海、诺日朗瀑布、长海、镜海和树正群海是核心看点。",
                        "秋季", "海拔较高，注意保暖和体力分配。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "兵马俑博物馆", "历史人文", "陕西省西安市临潼区秦陵北路",
                        "34.3849", "109.2785", "08:30-17:00", "029-81399127", "120",
                        4.8, 65000,
                        "秦始皇帝陵博物院以兵马俑坑为核心，集中展示秦代军事、雕塑和帝陵制度。",
                        "建议跟随讲解游览一号坑、三号坑、二号坑和文物陈列厅，理解陶俑阵列和修复过程。",
                        "兵马俑发现于20世纪70年代，是秦始皇陵的重要组成部分，考古和展示工作仍在持续推进。",
                        "一号坑军阵、铜车马、跪射俑和修复区最具代表性。",
                        "四季", "展馆客流大，建议提前预约并错峰参观。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "鼓浪屿", "城市休闲", "福建省厦门市思明区鼓浪屿",
                        "24.4475", "118.0679", "全天开放", "0592-2062868", "0",
                        4.7, 50000,
                        "鼓浪屿以海岛街巷、近代建筑、音乐文化和滨海景观闻名，是厦门代表性休闲目的地。",
                        "建议提前购买船票，步行串联日光岩、菽庄花园、龙头路和海边步道。",
                        "鼓浪屿近代以来形成多元建筑与社区文化，现以世界文化遗产身份进行保护与展示。",
                        "日光岩、菽庄花园、钢琴博物馆、万国建筑和海边日落适合慢游。",
                        "春秋冬", "岛上以步行为主，请穿舒适鞋并注意返程船班。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80"
                        ))
                ,
                spot(
                        "东方明珠广播电视塔", "城市休闲", "上海市浦东新区世纪大道1号",
                        "31.2397", "121.4998", "09:00-21:00", "021-58791888", "199",
                        4.7, 38000,
                        "东方明珠位于陆家嘴核心区，是上海城市天际线的代表性地标。",
                        "建议傍晚登塔，先看黄浦江两岸日落，再欣赏外滩夜景。",
                        "东方明珠建成于20世纪90年代，是浦东开发开放后上海现代城市形象的重要符号。",
                        "透明观光廊、太空舱、城市历史陈列馆和浦江夜景最受欢迎。",
                        "四季", "热门时段排队较久，建议提前预约。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1515890435782-59a5bb6ec191?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "南京夫子庙秦淮风光带", "历史人文", "江苏省南京市秦淮区贡院西街",
                        "32.0207", "118.7880", "全天开放", "025-52209788", "0",
                        4.6, 70000,
                        "夫子庙秦淮风光带融合文庙、贡院、秦淮河和老城街巷，是南京夜游经典区域。",
                        "推荐傍晚抵达，游览夫子庙、江南贡院，再乘画舫看秦淮灯影。",
                        "秦淮河两岸自古商贾云集、文脉深厚，现代改造后形成历史文化街区与夜游线路。",
                        "夫子庙、江南贡院、乌衣巷、秦淮画舫和夜景灯会是亮点。",
                        "春秋冬", "节假日夜间人流密集，注意错峰。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "苏州拙政园", "历史人文", "江苏省苏州市姑苏区东北街178号",
                        "31.3267", "120.6294", "07:30-17:30", "0512-67510286", "80",
                        4.8, 30000,
                        "拙政园是江南古典园林代表，以水面、亭榭、花木和借景组织空间。",
                        "建议上午入园，按东园、中园、西园慢游，留意窗景、廊桥和水面倒影。",
                        "拙政园始建于明代，历经多次修建，体现了江南文人园林的空间审美。",
                        "远香堂、小飞虹、荷风四面亭和园林窗景是代表看点。",
                        "春夏秋", "旺季需预约，雨天游园也很有韵味。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "桂林漓江风景区", "自然风光", "广西壮族自治区桂林市灵川县",
                        "25.1630", "110.4240", "08:00-17:30", "0773-2825502", "210",
                        4.8, 45000,
                        "漓江以喀斯特峰林、清澈江水和田园村落闻名，是桂林山水的核心体验。",
                        "经典方式是从桂林乘船至阳朔，也可选择兴坪段精华游。",
                        "漓江山水长期进入诗画传统和旅游叙事，形成极具辨识度的中国山水景观。",
                        "九马画山、黄布倒影、兴坪古镇和阳朔江段是热门点位。",
                        "春秋", "雨季水位变化较大，乘船请关注班次。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "丽江古城", "历史人文", "云南省丽江市古城区",
                        "26.8721", "100.2345", "全天开放", "0888-5111118", "50",
                        4.7, 60000,
                        "丽江古城以纳西族街巷、水系、民居和雪山背景闻名，是滇西北人文旅游代表。",
                        "建议清晨或夜间慢行四方街、木府、五一街和黑龙潭周边。",
                        "丽江古城依托茶马古道和多民族文化发展，形成开放式历史街区格局。",
                        "四方街、木府、古城水系、狮子山观景和夜间街巷最受欢迎。",
                        "春秋", "石板路较多，雨天注意防滑。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "大理洱海", "自然风光", "云南省大理白族自治州大理市",
                        "25.8060", "100.1990", "全天开放", "0872-2674146", "0",
                        4.7, 50000,
                        "洱海是大理最具代表性的湖泊景观，苍山、村落和环湖公路构成休闲旅行线路。",
                        "推荐环海西路骑行或自驾，串联喜洲、双廊、才村和龙龛码头。",
                        "洱海长期滋养白族聚落和农耕生活，现代环湖旅游更强调生态保护与慢旅行。",
                        "龙龛日出、喜洲古镇、双廊湖景和苍山远眺是核心体验。",
                        "四季", "环湖请遵守生态保护要求，不要进入封闭湿地区域。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "成都宽窄巷子", "城市休闲", "四川省成都市青羊区金河路口",
                        "30.6674", "104.0568", "全天开放", "028-86259233", "0",
                        4.5, 55000,
                        "宽窄巷子由宽巷子、窄巷子和井巷子组成，是成都院落街区和休闲消费的代表。",
                        "适合下午到夜间慢逛，体验茶馆、川菜、小吃和院落建筑。",
                        "街区保留了清代少城格局的部分肌理，更新后成为成都城市文化名片。",
                        "宽巷子院落、窄巷子餐饮、井巷子市井气息和夜间灯光适合拍照。",
                        "四季", "商业街区人流密集，注意保管随身物品。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "重庆洪崖洞", "城市休闲", "重庆市渝中区嘉陵江滨江路88号",
                        "29.5622", "106.5770", "11:00-23:00", "023-63039995", "0",
                        4.6, 80000,
                        "洪崖洞依山临江，以吊脚楼风貌、夜景灯光和山城立体交通成为重庆热门地标。",
                        "建议傍晚从千厮门大桥或江边平台观景，再进入街区游览。",
                        "洪崖洞所在区域承载山城码头记忆，现代更新后成为夜游和城市观景节点。",
                        "吊脚楼夜景、千厮门大桥视角、嘉陵江江景和美食街区最受欢迎。",
                        "四季", "夜间客流非常大，建议错峰拍照。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1515890435782-59a5bb6ec191?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "青海湖二郎剑景区", "自然风光", "青海省海南藏族自治州共和县",
                        "36.7520", "100.4930", "08:30-18:00", "0974-8519680", "90",
                        4.6, 30000,
                        "青海湖是中国最大的内陆咸水湖，湖光、草原、油菜花和候鸟构成高原风景。",
                        "夏季适合看油菜花和湖面蓝色层次，自驾环湖需注意高原天气。",
                        "青海湖周边是高原生态与多民族文化交汇区域，旅游开发强调生态保护。",
                        "二郎剑湖岸、油菜花田、鸟岛方向和环湖公路是主要体验。",
                        "夏季", "海拔较高，注意防晒和保暖。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "天山天池", "自然风光", "新疆维吾尔自治区昌吉回族自治州阜康市",
                        "43.8830", "88.1240", "09:00-19:00", "0994-3526477", "95",
                        4.7, 28000,
                        "天山天池以高山湖泊、雪峰、云杉林和哈萨克民俗体验闻名。",
                        "推荐乘区间车上山，沿湖步道游览，天气好时可远眺博格达峰。",
                        "天池自古与天山神话和丝路交通记忆相连，现代成为新疆代表性山岳湖泊景区。",
                        "湖畔步道、定海神针、博格达峰远眺和云杉林是亮点。",
                        "夏秋", "山区天气变化快，注意保暖。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "三亚亚龙湾", "自然风光", "海南省三亚市吉阳区亚龙湾国家旅游度假区",
                        "18.2290", "109.6410", "全天开放", "0898-88568899", "0",
                        4.7, 70000,
                        "亚龙湾以海湾沙滩、清澈海水、度假酒店和水上活动闻名，是三亚经典海滨目的地。",
                        "适合安排半天到一天，上午海滩活动，傍晚看海湾日落。",
                        "亚龙湾较早形成国家级旅游度假区，度假设施成熟，是海南滨海旅游代表。",
                        "海滩、热带天堂森林公园、潜水活动和海湾日落最受欢迎。",
                        "冬春", "海边紫外线强，请注意防晒。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "拉萨布达拉宫", "历史人文", "西藏自治区拉萨市城关区北京中路35号",
                        "29.6578", "91.1175", "09:30-15:20", "0891-6822896", "200",
                        4.8, 12000,
                        "布达拉宫依山而建，是拉萨城市天际线和藏传佛教建筑艺术的代表。",
                        "建议提前预约，参观时放慢节奏，结合药王山观景台欣赏外观。",
                        "布达拉宫历史悠久，建筑、壁画、文物和宗教空间共同体现高原文化传统。",
                        "白宫、红宫、金顶、药王山观景台和夜景照明是核心看点。",
                        "春夏秋", "海拔较高，初到拉萨请避免剧烈运动。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        ))
                ,
                spot(
                        "泰山风景名胜区", "自然风光", "山东省泰安市泰山区红门路",
                        "36.2570", "117.1060", "05:00-23:00", "0538-96008888", "115",
                        4.8, 55000,
                        "泰山以雄伟山势、摩崖石刻和封禅文化闻名，是五岳之首的代表性山岳景区。",
                        "经典线路从红门徒步至南天门，也可乘车到中天门再换索道，日出需提前规划夜爬时间。",
                        "泰山长期承载国家祭祀、文人游历和民间祈福传统，自然景观与历史文化高度融合。",
                        "十八盘、南天门、玉皇顶、日观峰和摩崖石刻是核心看点。",
                        "春秋", "山顶温差大，夜爬请备保暖衣物。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "华山风景名胜区", "自然风光", "陕西省渭南市华阴市集灵路",
                        "34.4830", "110.0830", "07:00-19:00", "0913-4362691", "160",
                        4.8, 42000,
                        "华山以险峻山势、奇峰绝壁和道教文化闻名，是西岳代表景区。",
                        "体力充足可选择西上北下或北上西下，重点游览西峰、南峰和长空栈道周边。",
                        "华山自古以险著称，山路、宫观和题刻共同构成独特的山岳文化景观。",
                        "西峰、南峰、北峰、苍龙岭和长空栈道是热门点位。",
                        "春秋", "部分路段陡峭，请量力而行。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "平遥古城", "历史人文", "山西省晋中市平遥县古城内",
                        "37.2010", "112.1760", "全天开放", "0354-5690000", "125",
                        4.7, 35000,
                        "平遥古城保存了较完整的明清县城格局，城墙、票号、县衙和街巷系统极具代表性。",
                        "建议住一晚，白天看县衙、日升昌和城墙，夜晚慢逛明清街。",
                        "平遥因晋商票号和古城格局闻名，是理解明清商业文化的重要目的地。",
                        "古城墙、日升昌票号、县衙、明清街和双林寺是核心看点。",
                        "春秋", "古城内步行为主，建议穿舒适鞋。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "云冈石窟", "历史人文", "山西省大同市云冈区云冈镇",
                        "40.1090", "113.1220", "08:30-17:30", "0352-7992622", "120",
                        4.8, 30000,
                        "云冈石窟以北魏佛教造像艺术闻名，是中国石窟艺术的重要代表。",
                        "推荐按主要洞窟顺序参观，重点留意第5、6窟和昙曜五窟。",
                        "云冈石窟开凿于北魏时期，融合中原、草原和外来艺术风格。",
                        "昙曜五窟、第5窟、第6窟、露天大佛和石雕细节最具代表性。",
                        "春秋", "文物景区请勿触摸造像。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "武夷山风景名胜区", "自然风光", "福建省南平市武夷山市三姑度假区",
                        "27.6560", "117.9650", "07:30-17:30", "0599-5252884", "140",
                        4.7, 42000,
                        "武夷山以丹霞地貌、九曲溪、茶文化和朱子理学遗迹闻名。",
                        "推荐竹筏漂流九曲溪，再游天游峰、大红袍景区和一线天。",
                        "武夷山兼具自然遗产和文化遗产价值，茶山、书院和山水游线相互交织。",
                        "九曲溪、天游峰、大红袍母树、一线天和岩茶体验是亮点。",
                        "春秋", "竹筏票紧张时需提前预约。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "庐山风景名胜区", "自然风光", "江西省九江市庐山市牯岭镇",
                        "29.5650", "115.9740", "07:30-18:00", "0792-8296565", "160",
                        4.7, 43000,
                        "庐山以山地避暑、云雾瀑布、近代别墅和人文遗迹闻名。",
                        "建议住牯岭镇，串联花径、如琴湖、锦绣谷、三叠泉和美庐。",
                        "庐山兼具山水审美、宗教文化和近现代历史记忆，是复合型山岳景区。",
                        "三叠泉、锦绣谷、含鄱口、美庐和牯岭街是核心体验。",
                        "夏秋", "山上多雾，注意交通和步道安全。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1536152470836-b943b246224c?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "乌镇西栅", "历史人文", "浙江省嘉兴市桐乡市石佛南路18号",
                        "30.7460", "120.4860", "09:00-22:00", "0573-88731088", "150",
                        4.6, 50000,
                        "乌镇西栅以水乡街巷、夜景灯光、民宿和江南生活体验闻名。",
                        "推荐下午入园，白天看水巷和展馆，晚上欣赏夜景。",
                        "乌镇依托江南水乡格局和传统民居更新，形成成熟的古镇度假景区。",
                        "水阁、石桥、染坊、木心美术馆和西栅夜景是热门看点。",
                        "春秋冬", "夜游人多，住宿需提前预订。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "普陀山风景名胜区", "历史人文", "浙江省舟山市普陀区梅岑路",
                        "30.0090", "122.3860", "06:30-21:00", "0580-3191919", "160",
                        4.7, 45000,
                        "普陀山以海天佛国、寺院群和海岛景观闻名，是中国佛教名山之一。",
                        "建议安排一到两天，游览普济寺、法雨寺、南海观音和百步沙。",
                        "普陀山长期作为观音信仰中心，寺院、海岸和山林共同构成文化景观。",
                        "普济寺、法雨寺、南海观音、紫竹林和海边步道是核心看点。",
                        "春秋", "需乘船进岛，请关注天气和航班。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "广州长隆旅游度假区", "城市休闲", "广东省广州市番禺区汉溪大道东299号",
                        "23.0050", "113.3270", "10:00-19:00", "400-883-0083", "300",
                        4.6, 90000,
                        "广州长隆集合野生动物世界、欢乐世界、水上乐园和演艺项目，适合亲子与休闲旅行。",
                        "亲子游可优先野生动物世界，年轻游客可组合欢乐世界和大马戏。",
                        "长隆度假区依托主题乐园集群发展，形成华南地区代表性综合文旅目的地。",
                        "野生动物世界、垂直过山车、水上乐园和大马戏是热门体验。",
                        "四季", "园区大，建议提前规划路线和演出时间。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "深圳世界之窗", "城市休闲", "广东省深圳市南山区深南大道9037号",
                        "22.5360", "113.9730", "09:00-22:00", "0755-26608000", "220",
                        4.5, 65000,
                        "世界之窗以世界著名景观微缩和主题演艺为特色，是深圳老牌主题公园。",
                        "适合下午入园，白天看微缩景观，夜晚看灯光和演出。",
                        "世界之窗见证了深圳主题公园旅游的发展，是城市休闲和研学游常见选择。",
                        "埃菲尔铁塔微缩、凯旋门、世界广场和夜间演艺是热门点位。",
                        "四季", "夏季注意防晒，夜场体验更轻松。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1515890435782-59a5bb6ec191?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "哈尔滨冰雪大世界", "城市休闲", "黑龙江省哈尔滨市松北区太阳岛西侧",
                        "45.8050", "126.5850", "11:00-22:00", "0451-58561401", "328",
                        4.6, 80000,
                        "哈尔滨冰雪大世界以大型冰建、灯光、冰滑梯和冬季演艺闻名。",
                        "建议傍晚入园，既能看冰雕细节，也能欣赏夜间灯光效果。",
                        "冰雪大世界依托哈尔滨冰雪文化发展，成为冬季旅游代表项目。",
                        "冰雕建筑、超级冰滑梯、主题灯光和冬季演艺是核心体验。",
                        "冬季", "气温极低，请做好防寒保暖。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                        )),
                spot(
                        "沈阳故宫", "历史人文", "辽宁省沈阳市沈河区沈阳路171号",
                        "41.7950", "123.4560", "08:30-17:00", "024-24843001", "50",
                        4.6, 26000,
                        "沈阳故宫是清初宫殿建筑群，体现满族宫廷制度和东北地域建筑特色。",
                        "建议与张氏帅府、中街组合一日游，重点看大政殿和崇政殿。",
                        "沈阳故宫始建于后金时期，是清王朝入关前的重要政治中心。",
                        "大政殿、十王亭、崇政殿和宫廷展陈是主要看点。",
                        "四季", "冬季室外参观注意保暖。",
                        Arrays.asList(
                                "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
                        ))
        );
    }

    private Facility facility(FacilityType type, String name, String lat, String lng, String price,
                              Integer spaces, Double hygiene, String cuisine, String averageCost, double rating) {
        Facility facility = new Facility();
        facility.setType(type);
        facility.setName(name);
        facility.setAddress(name + "附近");
        facility.setLatitude(new BigDecimal(lat));
        facility.setLongitude(new BigDecimal(lng));
        facility.setPrice(price == null ? null : new BigDecimal(price));
        facility.setAvailableSpaces(spaces);
        facility.setHygieneScore(hygiene);
        facility.setCuisine(cuisine);
        facility.setAverageCost(averageCost == null ? null : new BigDecimal(averageCost));
        facility.setRating(rating);
        return facility;
    }
}
