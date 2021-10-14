import React, { useState, useEffect } from 'react';
import PageLayout from '@/layouts/Page';
import Link from '@components/Link';


const License = () => {
  const meta = {
    title: 'License'
  };

  const [year, setYear] = useState(2021);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <PageLayout meta={meta}>
      <section className="page-hero">
        <div className="container-wrapper">
          <h1>
            MIT License <small>Enterprise-ready and flexible license.</small>
          </h1>
        </div>
      </section>

      <section className="container-wrapper mt-12">
        <strong className="block mb-4">MIT License</strong>
        <p className="mb-4">Copyright &copy; 2017-{year} Kyle Ross</p>

        <p className="mb-4">
          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the "Software"), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>
        <p className="mb-4">
          The above copyright notice and this permission notice shall be included in all
          copies or substantial portions of the Software.
        </p>
        <p className="mb-8">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
          SOFTWARE.
        </p>

        <Link className="text-sm" href="https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE">View on Github</Link>
      </section>

      <section className="container-wrapper mt-12">
        <h2>Dependency Licenses</h2>
        <ul className="list-disc ml-8">
          <li>
            <Link className="font-semibold" href="https://github.com/davidmarkclements/fast-safe-stringify/blob/master/LICENSE">fast-safe-stringify</Link> — MIT License
          </li>
        </ul>
      </section>
    </PageLayout>
  );
};


export default License;
