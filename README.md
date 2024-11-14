<div align="center">

# 🌸✨ Fetch-Me-My-Waifus ✨🌸

<p align="center">
  <img src="https://img.shields.io/github/downloads/DuckyOnQuack-999/Fetch-Me-My-Waifus/total?color=%23FF69B4" alt="GitHub Downloads" />
  <img src="https://img.shields.io/github/v/release/DuckyOnQuack-999/Fetch-Me-My-Waifus?color=%23FF69B4" />
  <img src="https://img.shields.io/badge/Windows%2011-%23FF69B4.svg?style=flat-square&logo=windows11&logoColor=black" alt="Windows 11" />
  <img src="https://img.shields.io/badge/Python-%23FF69B4.svg?style=flat-square&logo=python&logoColor=black" alt="Python" />
</p>

🎀 The kawaii-est tool for fetching anime-style images with moe moe kyun~ energy! 🎀

[✨ Features](#-features) • [🚀 Installation](#-installation) • [💖 Usage](#-usage) • [🤝 Contributing](#-contributing) • [📜 License](#-license)

<img width="731" alt="6977" src="https://github.com/user-attachments/assets/7e227a12-d47b-4ab3-92ed-687962eb732a">

</div>

## 🌟 Features

- 🖼️ User-friendly GUI built with tkinter
- 🗂️ Customizable image categories
- 🔢 Adjustable download limits
- 🔞 NSFW content filter
- 🚀 Asynchronous downloads using threading
- 🛡️ Rate limiting to prevent API abuse
- 🔄 Error handling and retry functionality
- 🖼️ Image gallery display
- ⏯️ Pause and resume functionality

## 📥 Installation

1. Clone the repository:
```bash
   git clone https://github.com/DuckyOnQuack-999/Fetch-Me-My-Waifus.git
```
2. Navigate to the project directory:
```shellscript
 cd Fetch-Me-My-Waifuscd Fetch-Me-My-Waifus
```
3. Install the required dependencies:

```shellscript
 pip install -r requirements.txt
```

## 💖 Usage

Execute the main script to run the application:

```shellscript
 python Fetch-Me-My-Waifus.py
```

## 🛠️ Configuration

Customize your Fetch-Me-My-Waifus experience with these magical settings:

| Option | Description | Default | How to Change
|-----|-----|-----|-----
| Default Category | Initial category on startup | "waifu" | Modify `self.category_var` in `__init__`
| Download Limit | Max images per session | 10 | Adjust `self.limit_var` in `__init__`
| Rate Limit | Cooldown between API requests (seconds) | 1 | Change `self.rate_limit` in `__init__`
| NSFW Filter | Allow NSFW content by default | False | Set `self.nsfw_var` in `__init__`

## 🤝 Contributing

We welcome contributions to Fetch-Me-My-Waifus! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💻 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 🚀 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request


Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📜 License

This project is licensed under the GNU License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [waifu.im](https://waifu.im/) for providing the amazing API
- [Tkinter](https://docs.python.org/3/library/tkinter.html) for the GUI framework
- [Pillow](https://python-pillow.org/) for image processing magic
- All the wonderful contributors who have helped improve this project

## 🎨 Magical Girl Color Palette

| Color | Hex Code | Description
|-----|-----|-----
| Sakura Pink | `#FFB7C5` | For the sweetest UI elements
| Magical Blue | `#7EC8E3` | For calm and soothing accents
| Lemon Chiffon | `#FFFACD` | For soft, warm backgrounds
| Lavender Dream | `#E6E6FA` | For mystical highlights


## 📣 Disclaimer

This application is for educational and fanservice purposes only. Please respect the terms of service of the waifu.im API and use this tool responsibly. Remember, 2D waifus have feelings too!
