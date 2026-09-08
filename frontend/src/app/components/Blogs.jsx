import Image from "next/image";

const Blogs = (props) => {
  return (
    <>
      <div className={props.blogCard}>
        <div className="position-relative">
          {/* 🌟 SEO FIX: Descriptive link label */}
          <a href={props.blogImglink} aria-label={`Read article: ${props.blogTitle}`}>
            <Image
              src={props.imgSrcBlog || "/images/default.jpg"}
              className={props.blogClassImg}
              height={220}
              width={400}
              alt={props.blogImgALt || props.blogTitle || "Blog thumbnail"} // 🌟 SEO FIX
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </a>
          <div className="d-flex position-absolute justify-content-md-between justify-content-between w-100 px-3 align-items-end bottom-0 pb-2">
            <div>
              <a href={props.blogBtnHref} className="fs-6 text-white" aria-label={`Author: ${props.writer_name ?? "High Creation"}`}>
                <Image src="/images/user.png" width={20} height={20} alt="Author Icon" /> {props?.writer_name ?? "High Creation"}
              </a>
            </div>
          </div>
        </div>
        <div className="card-body px-3 pt-3">
          <span className="blog_span">{props.blogdate}</span>
          <h5 className="blog-title pt-2">{props.blogTitle}</h5>
          <p
            className="blog-text"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            dangerouslySetInnerHTML={{ __html: props.blogDescription }}>
          </p>
          <a 
            href={props.blogBtnHref} 
            className="btn_continue"
            aria-label={`${props.buttonBlog} - ${props.blogTitle}`} // 🌟 SEO FIX
          >
            {props.buttonBlog}
          </a>
        </div>
      </div>
    </>
  );
};

export default Blogs;