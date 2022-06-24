class MediaHelper {
  static toFile(file: string) {
    var matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches == null || matches.length !== 3) {
      throw Error("Invalid input string");
    }

    const data = Buffer.from(matches[2], "base64");
    return data;
  }
}

export default MediaHelper;
