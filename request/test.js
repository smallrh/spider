fetch("http://localhost:8081/ai/chat?message=你知道迈克尔乔丹吗").then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = ""; // 用于存储未满一行的文本
    const maxLength = 50; // 每行最大字符数

    reader.read().then(function processText({ done, value }) {
        if (done) {
            if (buffer.length > 0) console.log(buffer); // 打印最后剩余的部分
            return;
        }

        buffer += decoder.decode(value, { stream: true }); // 读取流数据

        while (buffer.length >= maxLength) {
            console.log(buffer.slice(0, maxLength)); // 输出定长文本
            buffer = buffer.slice(maxLength); // 截取剩余部分
            console.log("--------------------------------------------------------");
        }

        return reader.read().then(processText); // 继续读取下一批数据
    });
});

