const translations = {
  en: {
    //GENERAL
    title: "VTX tools",
    add: "Add",
    mhz: "MHz",
    vcat_title: "VTX Catalog (UA language only)",
    rcat_title: "RX Catalog (UA language only)",
    uacat_title: "🇺🇦 Catalog (UA language only)",
    channel: "💬 Updates and information (UA)",
    group_calculators: "Calculators",
    group_catalogs: "Catalogs",
    group_elrs: "ELRS Tools",

    //READ
    read_descr:
      "Utility for downloading the ELRS firmware directly from RX/TX via UART. It is possible to search for a wifi password without fully downloading the firmware. To work with the utility, the receiver must be in the bootloader mode (hold down the button before powering up)",

    //DIPOLE
    dpl_title: "Dipole calculator",
    dpl_descr:
      "This calculator helps to calculate the length of a dipole antenna by a given frequency, or vice versa - the frequency by the total length or the length of one leg.",
    dpl_ant_length: "Antenna length (cm)",
    dpl_leg_length: "Leg length (cm)",

    //ELRS
    elrs_title: "MafiaLRS firmware generator",
    elrs_device: "Device type",
    elrs_frq: "Frequency",
    elrs_brand: "Brand",
    elrs_target: "Target",
    elrs_generate_button: "Generate firmware",
    elrs_descr: `MafiaLRS firmware generator for any supported device, including targets that do not exist in the official configurator`,

    elrs_opt_device: "Select device type",
    elrs_opt_frq: "Select frequency",
    elrs_opt_brnd: "Select brand",
    elrs_opt_trgt: "Select target",

    elrs_fw_version: "MafiaLRS version: ",

    elrs_targets: "Total targets: ",
    elrs_info: "MafiaLRS manual (UA)",

    //INF
    inf_title: "ELRS info",
    inf_descr:
      "This tool allows you to parse useful information from the ELRS firmware bin file",
    inf_copy_button: "Copy layout",
    inf_firmware: "Firmware",
    inf_lua_name: "LUA name",
    inf_password: "Password",
    inf_layout: "Hardware layout:",
    inf_gen_button: "Generate MafiaLRS firmware",

    //LOGO
    logo_title: "OSD logo converter",
    logo_descr:
      "A simple tool for converting almost any image to a size and format suitable for use on the Betaflight loading screen. Has a primitive editor for minor adjustments",
    logo_paste_line1: "Click here to upload a picture",
    logo_paste_line2: "Or paste it from the clipboard",
    logo_title: "OSD logo converter",
    logo_satur: "Saturation",
    logo_contr: "Contrast",
    logo_scale: "Preview scale",
    logo_orig_option: "Original",
    logo_px_color: "Pixel color:",
    logo_px_size: "Pixel size:",
    logo_reset: "Reset drawing",
    logo_download: "Dowmnload BMP",

    //CFG
    cfg_title: "VTX config generator",
    aux_select: "AUX for VTX control",
    vtx_template: "VTX template",
    vtx_serial_port: "VTX serial port",
    vtx_protocol: "VTX protocol",
    default_band: "Default band",
    default_channel: "Default channel",
    power_state_1: "Power state 1",
    power_state_2: "Power state 2",
    power_state_3: "Power state 3",
    include_checkbox: "Include VTX table for selected template",
    vtx_notice:
      "Attention! The selected transmitter is not recommended for use or the frequency table may be inaccurate.",
    vtx_notice_2: "Attention! The frequency table may be inaccurate.",

    cfg_descr: `"All-in-one" Betaflight CLI command generator for configuring VTX. It allows you to configure in detail the power/band/channel switching using the toggle on your radio. Offers templates (including frequency tables) for some popular VTX models`,

    version: "Version",
    theme_toggle: "🌤 Switch theme",

    generate_button: "Generate CLI",
    copy_button: "Copy result",
    copied_to_clipboard: "Copied to clipboard!",

    aux_select_tooltip:
      "AUX channel of the 3-position toggle switch, which will be used to select the power of the video transmitter. This is usually the SC toggle",
    vtx_template_tooltip:
      "You can choose a configuration template for some popular VTXs. Affects the settings below. Also includes a channels table for the selected VTX.",
    vtx_serial_port_tooltip:
      "The number of the UART port to which the VTX control wire is soldered. For SpeedyBee F405 v3 it is UART 1 (TX1 pin).",
    vtx_protocol_tooltip:
      "The control protocol used in VTX. Defined by the template, but can be changed manually.",
    default_band_tooltip:
      "The transmitter will be tuned to this band after applying the CLI command.",
    default_channel_tooltip:
      "The transmitter will be tuned to this channel after applying the CLI command.",

    power_state_1_tooltip:
      "Power value for the first position of the toggle (up). This is usually the lowest (25mW) power value. This is actually the sequence number of the powervalue from the frequency table. Below you can change the limits for determining this toggle position.",
    power_state_2_tooltip:
      "Power value for the second position of the toggle (center). This is usually the middle power value. This is actually the sequence number of the powervalue from the frequency table. Below you can change the limits for determining this toggle position.",
    power_state_3_tooltip:
      "Power value for the third toggle position (down). This is usually the highest power value. This is actually the sequence number of the powervalue from the frequency table. Below you can change the limits for determining this toggle position.",

    band_checkbox: "Include band/channel change capability",
    six_band_checkbox: "6-position toggle",
    band_select: "AUX for band change",
    band_select_option: "Select AUX",
    band_state_1: "Band 1",
    band_state_2: "Band 2",
    band_state_3: "Band 3",
    band_state_4: "Band 4",
    band_state_5: "Band 5",
    band_state_6: "Band 6",

    band_0_option: "Do not change band",
    band_a_option: 'Band "A"',
    band_b_option: 'Band "B"',
    band_e_option: 'Band "E"',
    band_f_option: 'Band "F"',
    band_r_option: 'Band "R"',
    band_6_option: "‼️ Band #6 in the frequency table",
    band_7_option: "‼️ Band #7 in the frequency table",
    band_8_option: "‼️ Band #8 in the frequency table",

    channel_state_1: "Channel 1",
    channel_state_2: "Channel 2",
    channel_state_3: "Channel 3",
    channel_state_4: "Channel 4",
    channel_state_5: "Channel 5",
    channel_state_6: "Channel 6",
    channel_0_option: "Do not change channel",
    channel_1_option: "Channel 1",
    channel_2_option: "Channel 2",
    channel_3_option: "Channel 3",
    channel_4_option: "Channel 4",
    channel_5_option: "Channel 5",
    channel_6_option: "Channel 6",
    channel_7_option: "Channel 7",
    channel_8_option: "Channel 8",

    band_select_tooltip:
      "3-position toggle AUX channel used for band switching. You can't select the AUX already assigned for VTX power control. No default value, must be manually selected to proceed.",
    band_state_1_tooltip:
      "Band assigned to the first toggle position (up). Below you can change the limits for determining this toggle position. Warning‼️ bands 6-8 might not be supported by your VTX. Only select if you are sure they are supported.",
    band_state_2_tooltip:
      "Band assigned to the second toggle position (center). Below you can change the limits for determining this toggle position. Warning‼️ bands 6-8 might not be supported by your VTX. Only select if you are sure they are supported.",
    band_state_3_tooltip:
      "Band assigned to the third toggle position (down). Below you can change the limits for determining this toggle position. Warning‼️ bands 6-8 might not be supported by your VTX. Only select if you are sure they are supported.",
    band_state_4_tooltip:
      "Band assigned to the fourth toggle position. Below you can change the limits for determining this toggle position. Warning‼️ bands 6-8 might not be supported by your VTX. Only select if you are sure they are supported.",
    band_state_5_tooltip:
      "Band assigned to the fifth toggle position. Below you can change the limits for determining this toggle position. Warning‼️ bands 6-8 might not be supported by your VTX. Only select if you are sure they are supported.",
    band_state_6_tooltip:
      "Band assigned to the sixth toggle position. Below you can change the limits for determining this toggle position. Warning‼️ bands 6-8 might not be supported by your VTX. Only select if you are sure they are supported.",

    channel_state_1_tooltip:
      "Channel assigned to the first toggle position (up). Below you can change the limits for determining this toggle position.",
    channel_state_2_tooltip:
      "Channel assigned to the second toggle position (center). Below you can change the limits for determining this toggle position.",
    channel_state_3_tooltip:
      "Channel assigned to the third toggle position (down). Below you can change the limits for determining this toggle position.",
    channel_state_4_tooltip:
      "Channel assigned to the fourth toggle position. Below you can change the limits for determining this toggle position.",
    channel_state_5_tooltip:
      "Channel assigned to the fifth toggle position. Below you can change the limits for determining this toggle position.",
    channel_state_6_tooltip:
      "Channel assigned to the sixth toggle position. Below you can change the limits for determining this toggle position.",
    migration_banner:
      "Attention! The configurator has moved to a separate domain. Access via this URL will be disabled soon.",
    migration_banner_link: "Switch to a new domain ➤",
    connection_failed: "Failed to connect to FC",
    failed_to_send_commands: "Failed to send commands to FC",
    config_sent_successfully: "Configuration sent successfully",
    send_button: "Send to FC",
    send_button_progress: "Sending...",

    //CH
    ch_title: "Channel distribution calculator",
    ch_band: "Band",
    ch_channel: "Channel",
    ch_pilots: "Number of pilots",
    ch_selected: "Selected channels:",

    ch_pilots_tooltip:
      "Select the number of pilots who plan to fly simultaneously",

    ch_1_pilot_option: "1 pilot",
    ch_2_pilots_option: "2 pilots",
    ch_3_pilots_option: "3 pilots",
    ch_4_pilots_option: "4 pilots",
    ch_5_pilots_option: "5 pilots",
    ch_6_pilots_option: "6 pilots",

    ch_includeXBand: "Include X-band",
    ch_includeLBand: "Include L-band",
    ch_calculateChannelsButton: "Calculate channels",
    ch_descr: `A utility that helps to “share” channels between several pilots during a simultaneous flight. Using a given video channel, it searches for the most distant (by frequency) channels. Also, the script tries to find the channels that are as far away from each other as possible`,

    ch_selected_toast: "This channel has already been added",
    ch_max_toast: "A maximum of 5 channels can be added manually",

    //ANT
    ant_title: "The closest channel by frequency",
    ant_freq: "Frequency (MHz)",
    ant_freq_start: "Start (MHz)",
    ant_freq_end: "End (MHz)",
    ant_ch_count: "Number of channels",

    ant_descr:
      "This utility helps you to find the most productive video channel for a particular antenna by knowing at what frequency or in what range it has the best SWR (Standing Wave Ratio). If you measure this parameter and sort antennas by it, this utility will help you speed up the process",

    ant_freq_tooltip:
      "Enter the frequency at which your antenna has the best SWR",

    ant_freq_start_tooltip: "Enter the start frequency",
    ant_freq_end_tooltip:
      "Enter the end frequency to search inside a specific range, or leave it blank",

    //HRM
    hrm_calculate_button: "Calculate",
    hrm_channel_width: "Channel width (MHz)",
    hrm_control_frq: "Central frequency (MHz)",
    hrm_start_frq: "Start frequency (MHz)",
    hrm_end_frq: "End frequency (MHz)",
    hrm_title: "Harmonics calculator",
    hrm_harmonic: "Harmonic",
    hrm_no_result: "No harmonics found",
    hrm_tab_affected: "Affected channels",
    hrm_tab_unaffected: "Unaffected channels",

    hrm_control_tooltip:
      "The central frequency of the radiolink at which TX and RX interact. For example 915, 868 or 433 MHz",
    hrm_channel_width_tooltip:
      "The width of the channel between TX and RX. 30 MHz is the common value for custom-made regulatory domains, but this value can be unique for each custom ELRS firmware. For example, for FCC915 it is 23.4 MHz (903.500 - 926.900)",
    hrm_start_frq_tooltip:
      "The start frequency of the range. For example, for FCC915 it is 903.500 MHz",
    hrm_end_frq_tooltip:
      "The end frequency of the range. For example, for FCC915 it is 926.900 MHz",
    hrm_descr:
      "This utility helps to find video channels that may be negatively affected by harmonics generated by the TX radiation",

    //FRN
    frn_title: "Fresnel zone calculator",
    frn_descr:
      "It helps to determine the optimal, minimum, and critical distance from the center of the line of sight between the antennas to the first obstacles under this conditional line. In simpler terms, find the minimum height that will provide a line of sight and add the calculated number of meters",
    frn_frq: "Frequency (MHz)",
    frn_distance: "Distance (Km)",
    frn_zone1: "First zone: ",
    frn_zone80: "80% zone: ",
    frn_zone60: "60% zone: ",

    frn_frequency_tooltip: "TBD",
    frn_distance_tooltip: "TBD",
  },
  uk: {
    //GENERAL
    title: "VTX утиліти",
    descr: "dd",
    add: "Додати",
    mhz: "МГц",
    vcat_title: "Каталог VTX",
    rcat_title: "Каталог RX",
    uacat_title: "🇺🇦 Каталог",
    rcat_reset: "Скинути фільтри",
    channel: "💬 Оновлення та інформація",
    group_calculators: "Калькулятори",
    group_catalogs: "Каталоги",
    group_elrs: "ELRS Утиліти",

    //READ
    read_descr:
      "Утиліта для завантаження прошивки ELRS напряму з RX/TX через UART. Є можливість пошуку wifi паролю без повного завантаження прошивки. Для роботи з утилітою приймач має бути в bootloader режимі (утримуйте кнопку перед подачею живлення).",

    //ELRS
    elrs_title: "Генератор прошивки MafiaLRS",
    elrs_device: "Тип пристрою",
    elrs_frq: "Частота",
    elrs_brand: "Бренд",
    elrs_target: "Таргет",
    elrs_generate_button: "Згенерувати прошивку",
    elrs_descr: `Утиліта для генерації прошивки MafiaLRS під будь-який пристрій який підтримується, включаючи таргети яких не існує в офіційному конфігураторі`,

    elrs_opt_device: "Оберіть тип пристрою",
    elrs_opt_frq: "Оберіть частоту",
    elrs_opt_brnd: "Оберіть бренд",
    elrs_opt_trgt: "Оберіть таргет",

    elrs_fw_version: "Версія MafiaLRS: ",

    elrs_targets: "Таргетів: ",
    elrs_info: "Довідка MafiaLRS",

    //INF
    inf_title: "ELRS інфо",
    inf_descr:
      "Ця утиліта дозволяє переглянути корисну інформацію з bin файлу прошивки ELRS",
    inf_copy_button: "Скопіювати лейаут",
    inf_firmware: "Прошивка",
    inf_lua_name: "LUA назва",
    inf_password: "Пароль",
    inf_layout: "Лейаут:",
    inf_gen_button: "Згенерувати прошивку MafiaLRS",

    //DIPOLE
    dpl_title: "Калькулятор диполя",
    dpl_descr:
      "Цей калькулятор допоможе розрахувати довжину диполь-антени за заданою частотою, або навпаки – частоту за загальною довжиною антени або довжиною одного її плеча.",
    dpl_ant_length: "Довжина (см)",
    dpl_leg_length: "Плече (см)",

    //CFG
    cfg_title: "Генератор конфігурації VTX",
    aux_select: "AUX керування VTX",
    vtx_template: "Шаблон VTX",
    vtx_serial_port: "Серійний порт VTX",
    vtx_protocol: "Протокол VTX",
    default_band: "Діапазон за замовчуванням",
    default_channel: "Канал за замовчуванням",
    power_state_1: "Потужність 1",
    power_state_2: "Потужність 2",
    power_state_3: "Потужність 3",
    include_checkbox: "Додати таблицю частот для обраного VTX",
    vtx_notice:
      "Увага! Обраний передавач не рекомендовано для використання, або таблиця частот може мати неточності.",
    vtx_notice_2: "Увага! Таблиця частот може мати неточності.",

    cfg_descr: `Генератор CLI команди Betaflight для налаштування VTX. Дає можливість детально налаштувати перемикання потужності/діапазону/каналу з апаратури. Пропонує шаблони (включно з таблицями частот) для деяких популярних моделей VTX`,

    version: "Версія",
    theme_toggle: "🌤 Переключити тему",

    generate_button: "Згенерувати CLI команду",
    copy_button: "Скопіювати CLI",
    copied_to_clipboard: "Скопійовано в буфер!",

    aux_select_tooltip:
      "Канал AUX 3-х позиційного тоглу за допомогою якого буде змінюватися потужність відеопередавача. Зазвичай це тогл SC.",
    vtx_template_tooltip:
      "Ви можете обрати шаблон налаштувань для деяких популярних відеопередавачів. Впливає на параметри нижче. Шаблон також включає в себе таблицю каналів для обраного відеопередавача.",
    vtx_serial_port_tooltip:
      "Номер порту UART до якого припаяно дріт керування VTX. Для SpeedyBee F405 це UART 1 (контактна площадка TX1).",
    vtx_protocol_tooltip:
      "Протокол керування який використовується у VTX. Визначається шаблоном, але може бути змінений вручну.",
    default_band_tooltip:
      "Діапазон частот встановлений за замовчуванням. Передавач буде налаштований на цей діапазон після застосування CLI команди.",
    default_channel_tooltip:
      "Канал встановлений за замовчуванням. Передавач буде налаштований на цей канал після застосування CLI команди.",

    power_state_1_tooltip:
      "Значення потужності для першого положення тоглу (вгору). Зазвичай це найнижче (25мВт) значення потужністі. Фактично це порядковий номер значення потужності з таблиці частот. Нижче ви можете змінити ліміти для визначення цього положення тоглу.",
    power_state_2_tooltip:
      "Значення потужності для другого положення тоглу (по центру). Зазвичай це середнє значення потужністі. Фактично це порядковий номер значення потужності з таблиці частот. Нижче ви можете змінити ліміти для визначення цього положення тоглу.",
    power_state_3_tooltip:
      "Значення потужності для третього положення тоглу (вниз). Зазвичай це максимальне значення потужністі. Фактично це порядковий номер значення потужності з таблиці частот. Нижче ви можете змінити ліміти для визначення цього положення тоглу.",

    band_checkbox: "Додати можливість зміни діапазону/каналів",
    six_band_checkbox: "6-позиційний тогл",
    band_select: "AUX для зміни діапазону",
    band_select_option: "Оберіть AUX",
    band_state_1: "1й діапазон",
    band_state_2: "2й діапазон",
    band_state_3: "3й діапазон",
    band_state_4: "4й діапазон",
    band_state_5: "5й діапазон",
    band_state_6: "6й діапазон",

    band_0_option: "Не міняти діапазон",
    band_a_option: 'Діапазон "A"',
    band_b_option: 'Діапазон "B"',
    band_e_option: 'Діапазон "E"',
    band_f_option: 'Діапазон "F"',
    band_r_option: 'Діапазон "R"',
    band_6_option: "‼️ Діапазон #6 в таблиці частот",
    band_7_option: "‼️ Діапазон #7 в таблиці частот",
    band_8_option: "‼️ Діапазон #8 в таблиці частот",

    channel_state_1: "1й канал",
    channel_state_2: "2й канал",
    channel_state_3: "3й канал",
    channel_state_4: "4й канал",
    channel_state_5: "5й канал",
    channel_state_6: "6й канал",
    channel_0_option: "Не міняти канал",
    channel_1_option: "Канал 1",
    channel_2_option: "Канал 2",
    channel_3_option: "Канал 3",
    channel_4_option: "Канал 4",
    channel_5_option: "Канал 5",
    channel_6_option: "Канал 6",
    channel_7_option: "Канал 7",
    channel_8_option: "Канал 8",

    band_select_tooltip:
      "Канал AUX 3-х позиційного тоглу за допомогою якого буде змінюватися діапазон. Не можна обрати AUX який вже задіяний для керування потужністю VTX. Не має стандартного значення, обовʼязково треба обрати вручну для продовження роботи.",
    band_state_1_tooltip:
      "Діапазон який буде активовано для першого положення тоглу (вгору). Нижче ви можете змінити ліміти для визначення цього положення. Увага‼️ діапазони 6-8 можуть не підтримуватися вашим VTX. Обирайте тільки, якщо ви впевнені, що вони є.",
    band_state_2_tooltip:
      "Діапазон який буде активовано для другого положення тоглу (по центру). Нижче ви можете змінити ліміти для визначення цього положення. Увага‼️ діапазони 6-8 можуть не підтримуватися вашим VTX. Обирайте тільки, якщо ви впевнені, що вони є.",
    band_state_3_tooltip:
      "Діапазон який буде активовано для для третього положення тоглу (вниз). Нижче ви можете змінити ліміти для визначення цього положення. Увага‼️ діапазони 6-8 можуть не підтримуватися вашим VTX. Обирайте тільки, якщо ви впевнені, що вони є.",

    band_state_4_tooltip:
      "Діапазон який буде активовано для для четвертого положення тоглу. Нижче ви можете змінити ліміти для визначення цього положення. Увага‼️ діапазони 6-8 можуть не підтримуватися вашим VTX. Обирайте тільки, якщо ви впевнені, що вони є.",
    band_state_5_tooltip:
      "Діапазон який буде активовано для для п'ятого положення тоглу. Нижче ви можете змінити ліміти для визначення цього положення. Увага‼️ діапазони 6-8 можуть не підтримуватися вашим VTX. Обирайте тільки, якщо ви впевнені, що вони є.",
    band_state_6_tooltip:
      "Діапазон який буде активовано для для шостого положення тоглу. Нижче ви можете змінити ліміти для визначення цього положення. Увага‼️ діапазони 6-8 можуть не підтримуватися вашим VTX. Обирайте тільки, якщо ви впевнені, що вони є.",

    channel_state_1_tooltip:
      "Канал який буде активовано для першого положення тоглу (вгору). Нижче ви можете змінити ліміти для визначення цього положення.",
    channel_state_2_tooltip:
      "Канал який буде активовано для другого положення тоглу (по центру). Нижче ви можете змінити ліміти для визначення цього положення.",
    channel_state_3_tooltip:
      "Канал який буде активовано для для третього положення тоглу (вниз). Нижче ви можете змінити ліміти для визначення цього положення.",

    channel_state_4_tooltip:
      "Канал який буде активовано для для четвертого положення тоглу. Нижче ви можете змінити ліміти для визначення цього положення.",
    channel_state_5_tooltip:
      "Канал який буде активовано для для п'ятого положення тоглу. Нижче ви можете змінити ліміти для визначення цього положення.",
    channel_state_6_tooltip:
      "Канал який буде активовано для для шостого положення тоглу. Нижче ви можете змінити ліміти для визначення цього положення.",

    migration_banner:
      "Увага! Конфігуратор переїхав на окремий домен. Доступ за цією адресою скоро буде вимкнено.",
    migration_banner_link: "Перейти на новий домен ➤",
    connection_failed: "Не вдалося підключитися до FC",
    failed_to_send_commands: "Не вдалося відправити команди до FC",
    config_sent_successfully: "Конфігурацію успішно відправлено",
    send_button: "Відправити в FC",
    send_button_progress: "Відправляю...",

    //CH
    ch_title: "Калькулятор розподілу каналів",
    ch_band: "Діапазон",
    ch_channel: "Канал",
    ch_pilots: "Кількість пілотів",
    ch_selected: "Обрані канали:",

    ch_pilots_tooltip:
      "Оберіть кількість пілотів які планують літати одночасно",

    ch_1_pilot_option: "1 пілот",
    ch_2_pilots_option: "2 пілоти",
    ch_3_pilots_option: "3 пілоти",
    ch_4_pilots_option: "4 пілоти",
    ch_5_pilots_option: "5 пілотів",
    ch_6_pilots_option: "6 пілотів",

    ch_includeXBand: "Додати X-діапазон",
    ch_includeLBand: "Додати L-діапазон",
    ch_calculateChannelsButton: "Розрахувати канали",
    ch_descr: `Утиліта, яка допомагає "поділити" канали між декількома пілотами при одночасному польоті. Використовуючи заданий відеоканал шукає максимально далекі (по частоті) канали. Також, скрипт намагається підібрати максимально далекі один від одного канали`,
    ch_selected_toast: "Цей канал вже додано",
    ch_max_toast: "Вручну можна додати максимум 5 каналів",

    //ANT
    ant_title: "Пошук каналу по частоті",
    ant_freq: "Частота (МГц)",
    ant_freq_start: "Старт (МГц)",
    ant_freq_end: "Фініш (МГц)",
    ant_ch_count: "Кількість каналів",
    ant_descr:
      "Дозволяє знайти максимально продуктивний відеоканал для конкретної антени, знаючи на якій частоті, або в якому діапазоні у неї найкращий КСХ (Коефіцієнт Стоячої Хвилі). Якщо ви заміряєте цей параметр і сортуєте антени по ньому, то дана утиліта допоможе вам прискорити цей процес",

    ant_freq_start_tooltip: "Введіть стартову частоту",
    ant_freq_end_tooltip:
      "Введіть кінцеву частоту для пошуку по конкретному діапазону, або залиште порожнім",

    //LOGO
    logo_title: "Конвертор логотипа для OSD",
    logo_descr:
      "Простий інструмент для конвертації майже будь-якого зображення у розмір і формат який підходить для використання на екрані завантаження Betaflight. Має примітивний редактор результату для незначних корегувань",
    logo_paste_line1: "Натисніть тут, або вставте",
    logo_paste_line2: "зображення з буфера обміну",
    logo_satur: "Насиченість",
    logo_contr: "Контраст",
    logo_scale: "Масштаб перегляду",
    logo_orig_option: "Оигінал",
    logo_px_color: "Колір рпікселю:",
    logo_px_size: "Розмір пікселю:",
    logo_reset: "Скасувати зміни",
    logo_download: "Завантажити BMP",

    //HRM
    hrm_calculate_button: "Розрахувати",
    hrm_channel_width: "Ширина каналу (MHz)",
    hrm_control_frq: "Центральна частота (MHz)",
    hrm_start_frq: "Початкова частота (MHz)",
    hrm_end_frq: "Кінцева частота (MHz)",
    hrm_title: "Калькулятор гармонік",
    hrm_harmonic: "Гармоніка",
    hrm_no_result: "Гармонік не знайдено",
    hrm_tab_affected: "Канали з гармоніками",
    hrm_tab_unaffected: `"Чисті" канали`,

    hrm_control_tooltip:
      "Центральна частота керування на якій взаємодіють TX та RX. Наприклад 915, 868 чи 433 МГц",
    hrm_channel_width_tooltip:
      "Ширина каналу керування між TX та RX. Для нестандартних частот часто використовують 30 МГц, але це значення може бути унікальним для кожної прошивки. Наприклад для FCC915 це 23.4 МГц (903.500 - 926.900)",
    hrm_start_frq_tooltip:
      "Початкова частота діапазону. Наприклад 903.500 МГц для FCC915",
    hrm_end_frq_tooltip:
      "Кінцева частота діапазону. Наприклад 926.900 МГц для FCC915",
    hrm_descr:
      "Ця утиліта допоможе вам знайти відеоканали на які можуть негативно вплинути гармоніки від випромінювання передавача керування",

    //FRN
    frn_title: "Калькулятор зони Френеля",
    frn_descr:
      "Допомагає визначити оптимальну, мінімальну та критичну відстань від центру лінії прямої видимості між антенами до перших перешкод під цією умовною лінією. Якщо сказати простіше - знайдіть мінімальну висоту яка забезпечить лінію прямої видимості та додайте розраховану кількість метрів",
    frn_frq: "Частота (МГц)",
    frn_distance: "Дистанція (Км)",
    frn_zone1: "Перша зона: ",
    frn_zone80: "80% зона: ",
    frn_zone60: "60% зона: ",

    frn_frequency_tooltip: "TBD",
    frn_distance_tooltip: "TBD",
  },
}

function setLanguage(language) {
  localStorage.setItem("language", language)
  translatePage(language)
  updateLanguageSelector(language)
}

function getBrowserLanguage() {
  const language = navigator.language || navigator.userLanguage
  return language.startsWith("en") ? "en" : "uk"
}

function translatePage(language) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n")
    element.textContent = translations[language][key] || element.textContent
  })
  document.querySelectorAll("option[data-i18n]").forEach((option) => {
    const key = option.getAttribute("data-i18n")
    option.textContent = translations[language][key] || option.textContent
  })
}

function updateLanguageSelector(language) {
  document.getElementById("lang-en").classList.remove("active")
  document.getElementById("lang-uk").classList.remove("active")
  document.getElementById(`lang-${language}`).classList.add("active")
}

document.addEventListener("DOMContentLoaded", () => {
  const storedLanguage = localStorage.getItem("language")
  const language = storedLanguage || getBrowserLanguage()
  setLanguage(language)
})

function getTranslation(key) {
  const language = localStorage.getItem("language") || "en"
  return translations[language][key] || key
}
