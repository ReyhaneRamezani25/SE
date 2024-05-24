// import './Home.css';
// import React, { useState } from 'react';
// import Menu from './Menu';

// const Help = () => {
//   return (
//     <div>

//     </div>
//   );
// }

// export default Help;
import './Help.css';
import React from 'react';
import Menu from './Menu';

const Help = () => {
  return (
    <div className='help-container'>
      <h1>راهنمای کاربر برای استفاده از سامانه رزرو اتاق هتل</h1>

      <h2>۱. ورود به سیستم</h2>
      <p>
        ابتدا وارد صفحه اصلی سامانه شوید.
        اگر حساب کاربری ندارید، ثبت‌نام کنید و اگر حساب کاربری دارید، وارد شوید.
      </p>

      <h2>۲. رزرو اتاق</h2>
      <h3>۲.۱. انتخاب هتل و اتاق‌ها</h3>
      <p>
        از صفحه اصلی، هتل مورد نظر خود را انتخاب کنید.
        وارد صفحه مربوط به هتل شوید و لیست اتاق‌ها را مشاهده کنید.
        در کنار هر اتاق یک فیلد قرار دارد که در ابتدا عدد صفر درون آن نوشته شده است. تعداد اتاق‌های مورد نظر خود را در این فیلد وارد کنید.
        پس از انتخاب تعداد اتاق‌ها، بر روی گزینه "اقدام به رزرو" کلیک کنید.
      </p>

      <h3>۲.۲. وارد کردن مشخصات مسافران</h3>
      <p>
        پس از انتخاب اتاق‌ها، به صفحه جدیدی هدایت می‌شوید که باید مشخصات هر مسافر را وارد کنید.
        برای هر اتاق، فیلدهای نام، نام خانوادگی، کد ملی و شماره تلفن مسافر را تکمیل کنید.
        پس از وارد کردن تمامی اطلاعات، بر روی گزینه "پرداخت و نهایی کردن رزرو" کلیک کنید.
      </p>

      <h3>۲.۳. پرداخت اینترنتی</h3>
      <p>
        به درگاه بانکی هدایت می‌شوید و مبلغ رزرو را به صورت اینترنتی پرداخت کنید.
        پس از پرداخت موفق، یک پیام تایید به شما نمایش داده می‌شود و ایمیل تاییدیه رزرو به همراه کد رهگیری برای شما ارسال خواهد شد.
      </p>

      <h2>۳. مشاهده رزروها</h2>
      <p>
        در صفحه اصلی سایت، گزینه "لیست رزروها" را انتخاب کنید.
        در این صفحه، تاریخچه تمامی رزروهای شما به تفکیک هتل و تاریخ نمایش داده می‌شود.
        بر روی هر رزرو کلیک کنید تا جزئیات آن را مشاهده کنید.
      </p>

      <h2>۴. ثبت نظر و امتیاز</h2>
      <p>
        پس از اقامت در هتل، می‌توانید نظرات و امتیازات خود را ثبت کنید.
        در صفحه "لیست رزروها"، در کنار هر رزرو که از تاریخ ورود آن گذشته باشد، گزینه "ثبت نظر و امتیاز" نمایش داده می‌شود.
        با کلیک بر روی این گزینه، نظر و امتیاز خود را ثبت کنید.
      </p>

      <h2>۵. لغو رزرو</h2>
      <p>
        اگر نیاز به لغو رزرو داشتید، به صفحه "لیست رزروها" بروید.
        در کنار رزروهایی که هنوز تاریخ ورود آن‌ها نرسیده، گزینه "کنسل کردن رزرو" وجود دارد.
        بر روی این گزینه کلیک کنید و شماره پیگیری و شماره کارت بانکی خود را وارد کنید.
        پس از مطالعه قوانین مرتبط با لغو رزرو و تایید نهایی، رزرو شما لغو می‌شود و مبلغ به حساب شما برگردانده خواهد شد.
      </p>

      <h2>نکات مهم</h2>
      <p>
        تمامی فیلدهای مشخصات مسافران باید به صورت کامل و صحیح پر شوند.
        ایمیل تاییدیه و کد رهگیری را حتما نگهداری کنید.
        قوانین و شرایط لغو رزرو را به دقت مطالعه کنید تا از مقدار عودت وجه و زمان آن مطلع شوید.
      </p>

      <p>
        با استفاده از این راهنما می‌توانید به راحتی و با اطمینان از سامانه رزرو اتاق هتل بهره‌مند شوید.
      </p>
    </div>
  );
}

export default Help;
