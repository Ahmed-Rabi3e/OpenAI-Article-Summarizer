import { type FormEvent, type KeyboardEvent, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { copy, linkIcon, loader, tick } from "../assets/index";
import { useLazyGetSummaryQuery } from "../services/article";

interface Article {
  url: string;
  summary: string;
}

const Demo = () => {
  const [article, setArticle] = useState<Article>({ url: "", summary: "" });
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState<string>("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = localStorage.getItem("articles");
    if (articlesFromLocalStorage) {
      try {
        const parsedArticles: Article[] = JSON.parse(articlesFromLocalStorage);
        setAllArticles(parsedArticles);
      } catch {
        console.error("Failed to parse articles from localStorage");
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) {
      setArticle(existingArticle);
      return;
    }

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle: Article = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl: string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Paste the article link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <IoSend size={23} />
          </button>
        </form>

        {/* Browse History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={`link-${index}`}
                onClick={() => setArticle(item)}
                className="link_card"
              >
                <div
                  className="w-7 h-7 rounded-full bg-gray-100 shadow-inner backdrop-blur-sm flex justify-center items-center cursor-pointer"
                  onClick={() => handleCopy(item.url)}
                >
                  <img
                    src={copied === item.url ? tick : copy}
                    alt={copied === item.url ? "tick_icon" : "copy_icon"}
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
                <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                  {item.url}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Display Result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {(error as { data?: { error?: string } })?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="rounded-xl border border-gray-200 bg-white/20 shadow-inner backdrop-blur p-4">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
