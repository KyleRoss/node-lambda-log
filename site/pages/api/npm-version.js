export default async function getNpmVersion(req, res) {
  try {
    const data = await fetch('https://registry.npmjs.org/lambda-log').then(resp => resp.json());
    const version = data?.['dist-tags']?.latest;

    if(!version) {
      return res.status(500).json({ error: 'Version not returned from NPM registry' });
    }

    return res.status(200).json({
      version,
      date: data.time[version]
    });
  } catch(err) {
    console.log(err);

    return res.status(500).json({ error: err.message });
  }
}
